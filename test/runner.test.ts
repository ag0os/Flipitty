import { test } from 'node:test';
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fixture } from './helpers.ts';

test('TOOL-2: test gate rejects skipped and todo tests', () => {
  fixture('{}', (_, dir) => {
    const file = join(dir, 'sample.test.ts');
    const cases = [
      { name: 'pass', body: "test('sample', () => {});", status: 0 },
      { name: 'skip', body: "test('sample', t => { t.skip(); });", status: 1 },
      { name: 'todo', body: "test('sample', t => { t.todo(); });", status: 1 }
    ];
    for (const example of cases) {
      writeFileSync(file, "import { test } from 'node:test';\n" + example.body);
      const env = { ...process.env };
      delete env.NODE_TEST_CONTEXT;
      const tests = spawnSync(process.execPath, ['--test', '--test-reporter=tap', file], {
        encoding: 'utf8',
        env
      });
      const result = spawnSync(process.execPath, [resolve('scripts/test-runner.mjs')], {
        encoding: 'utf8',
        input: tests.stdout
      });
      assert.equal(result.status, example.status, example.name + result.stderr);
    }
  });
});
