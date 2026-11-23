/**
 * Six Words, One Story
 *
 * Entry for the make.fun competition u-deranalabs-six-words-one-story-f982e410.
 *
 * The story: "The letter arrived after the funeral."
 *
 * Six words, one complete story. Someone wrote a letter, and by the time it
 * arrived the funeral had already happened. The turn is the timing: a message
 * meant for the living reaches a world where its reader is already gone.
 * What the letter said is left unsaid, and the reader fills it in.
 *
 * This program writes exactly that story, and nothing else, to
 * /output/entry.txt, then verifies the file byte for byte.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The story. Six words, one sentence, one life implied.
const STORY = "The letter arrived after the funeral.";

// Gate limits published in the competition rules.
const MIN_CHARS = 1;
const MAX_CHARS = 60;
const EXPECTED_WORDS = 6;

// Where the grader reads the entry.
const OUTPUT_PATH = "/output/entry.txt";

/**
 * Count the words in a text. Words are runs of non-whitespace characters,
 * so leading, trailing and doubled spaces never inflate the count.
 */
function countWords(text: string): number {
  const words = text.trim().split(/\s+/).filter((word) => word.length > 0);
  return words.length;
}

/**
 * Validate the story against the competition gate before anything is
 * written: UTF-8 text, 1 to 60 characters, not only white space, and
 * exactly six words. Any failure here is a hard error, never a silent fix.
 */
function validateStory(story: string): void {
  if (story.trim().length === 0) {
    throw new Error("Story must not be only white space.");
  }
  if (story.length < MIN_CHARS || story.length > MAX_CHARS) {
    throw new Error(
      `Story must be ${MIN_CHARS} to ${MAX_CHARS} characters, got ${story.length}.`,
    );
  }
  const words = countWords(story);
  if (words !== EXPECTED_WORDS) {
    throw new Error(`Story must be exactly ${EXPECTED_WORDS} words, got ${words}.`);
  }
}

/**
 * Write the story to the output path, creating the output directory first.
 * The file holds the story and nothing else: no trailing newline, no extra
 * whitespace, so the gate measures exactly the six words.
 */
function writeStory(story: string, outputPath: string): void {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, story, "utf8");
}

/**
 * Read the written file back and confirm it is byte for byte the story we
 * intended. A mismatch means the entry on disk is not the entry we wrote,
 * and the run must fail loudly instead of passing a wrong text to the judge.
 */
function verifyWrittenFile(story: string, outputPath: string): void {
  const written = readFileSync(outputPath, "utf8");
  if (written !== story) {
    throw new Error(
      `Verification failed: ${outputPath} does not match the story.\n` +
        `Expected: ${JSON.stringify(story)}\n` +
        `Found:    ${JSON.stringify(written)}`,
    );
  }
  if (countWords(written) !== EXPECTED_WORDS) {
    throw new Error("Verification failed: written file is not six words.");
  }
  if (written.length < MIN_CHARS || written.length > MAX_CHARS) {
    throw new Error("Verification failed: written file is outside 1 to 60 characters.");
  }
}

function main(): void {
  validateStory(STORY);
  writeStory(STORY, OUTPUT_PATH);
  verifyWrittenFile(STORY, OUTPUT_PATH);
  console.log(`Wrote ${OUTPUT_PATH}`);
  console.log(`Story: ${JSON.stringify(STORY)}`);
  console.log(`Words: ${countWords(STORY)}, characters: ${STORY.length}`);
  console.log("Verification passed: file matches the story exactly.");
}

main();
