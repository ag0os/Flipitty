import { spawnSync } from 'node:child_process';

const run = spawnSync(process.execPath, ['--test', '--test-reporter=tap', 'test/*.test.ts'], {
  encoding: 'utf8',
  stdio: ['inherit', 'pipe', 'inherit']
});
process.stdout.write(run.stdout);
const incomplete = /^# (?:fail|cancelled|skipped|todo) [1-9]\d*$/m.test(run.stdout);
const finished = /^# tests [1-9]\d*$/m.test(run.stdout) && /^# pass \d+$/m.test(run.stdout);
if (run.status !== 0 || incomplete || !finished) {
  console.error('Test gate: the test runner failed, ran no tests, or reported failed, cancelled, skipped, todo or incomplete tests');
  process.exitCode = 1;
}
