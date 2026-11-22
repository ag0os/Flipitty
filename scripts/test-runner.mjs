import { readFileSync } from 'node:fs';

const output = readFileSync(0, 'utf8');
process.stdout.write(output);
const incomplete = /^# (?:fail|cancelled|skipped|todo) [1-9]\d*$/m.test(output);
const finished = /^# tests \d+$/m.test(output) && /^# pass \d+$/m.test(output);
if (incomplete || !finished) {
  console.error('Test gate: failed, skipped, todo or incomplete tests are not allowed');
  process.exitCode = 1;
}
