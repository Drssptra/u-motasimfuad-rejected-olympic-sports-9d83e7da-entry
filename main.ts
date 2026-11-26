// Rejected Olympic Sports — "Speed Napping".
//
// The joke works like a broadcast listing: it opens with a plausible event
// name and a straight-faced race description, then slips in a rule that
// turns the whole contest upside down. The winner can never know they won,
// because knowing would mean being awake — so the gold medal goes to someone
// who will sleep through the ceremony.
//
// This program does one small job: assemble that single line, check it
// against the competition's gate (1–200 characters, one line, real text),
// and write it to /output/entry.txt with no trailing newline, so the file
// the judge reads is exactly the line and nothing else.

import { mkdirSync, writeFileSync } from "node:fs";

// Where the graded artifact lives, and the gate it has to pass.
const OUTPUT_DIR = "/output";
const OUTPUT_FILE = `${OUTPUT_DIR}/entry.txt`;
const GATE_MIN_CHARS = 1;
const GATE_MAX_CHARS = 200;

// --- The line, built from its beats -------------------------------------
//
// Each beat earns its place: the event name sells it as a real sport, the
// field sets up the race, the disqualification rule adds the absurdity,
// and the twist lands the punchline in the final clause.

const EVENT_NAME = "Speed Napping";
const FIELD_SETUP = "eight athletes race to fall asleep first";
const DISQUALIFY_RULE = "the snorer is disqualified";
const PUNCHLINE = "the winner never finds out";

function composeEntryLine(): string {
  // "Speed Napping: eight athletes race to fall asleep first; the snorer
  // is disqualified, and the winner never finds out."
  return `${EVENT_NAME}: ${FIELD_SETUP}; ${DISQUALIFY_RULE}, and ${PUNCHLINE}.`;
}

// --- Gate checks ----------------------------------------------------------
//
// The sealed scorer only accepts UTF-8 text of 1–200 characters that is
// not whitespace alone. We mirror those checks here so a bad line fails
// loudly in our own run instead of silently at grading time.

function countCharacters(text: string): number {
  // Count code points, not UTF-16 units, so an emoji would count as one.
  return [...text].length;
}

function validateEntryLine(text: string): void {
  const length = countCharacters(text);

  if (length < GATE_MIN_CHARS || length > GATE_MAX_CHARS) {
    throw new Error(
      `entry line is ${length} characters, outside the gate of ` +
        `${GATE_MIN_CHARS}–${GATE_MAX_CHARS}`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("entry line is blank or whitespace only");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry line must be a single line with no line breaks");
  }
  if (text !== text.trim()) {
    throw new Error("entry line must not start or end with whitespace");
  }
  // Control characters would be invisible junk in the judged text; the
  // line is plain printable prose, so any control character means a bug
  // in how the line was assembled.
  for (const ch of text) {
    if (ch.codePointAt(0)! < 0x20 || ch.codePointAt(0) === 0x7f) {
      throw new Error(
        `entry line contains a control character (U+${ch
          .codePointAt(0)!
          .toString(16)
          .padStart(4, "0")})`,
      );
    }
  }
}

// --- Output ---------------------------------------------------------------

function ensureOutputDir(): void {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

function writeEntryFile(text: string): void {
  // writeFileSync with the bare string: no "\n" appended, so the file ends
  // exactly where the line ends.
  writeFileSync(OUTPUT_FILE, text, "utf8");
}

// --- Entry point ----------------------------------------------------------

function main(): void {
  const line = composeEntryLine();
  validateEntryLine(line);
  ensureOutputDir();
  writeEntryFile(line);
  console.log(`wrote ${countCharacters(line)} characters to ${OUTPUT_FILE}`);
}

main();
