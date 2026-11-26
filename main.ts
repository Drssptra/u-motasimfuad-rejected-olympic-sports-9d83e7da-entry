import { mkdirSync, writeFileSync } from "node:fs";

// Rejected Olympic Sports — one line, written exactly as the judge reads it.
// The event sounds like a real broadcast listing until the last clause flips it:
// a race you can only win by not knowing you won.
const LINE =
  "Speed Napping: eight athletes race to fall asleep first; the snorer is disqualified, and the winner never finds out.";

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LINE);
