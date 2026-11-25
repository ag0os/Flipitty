import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fixture } from './helpers.ts';

test('TOOL-2: test gate rejects failing, cancelled, crashing, skipped and todo tests', () => {
  const gate = resolve('scripts/test-runner.mjs');
  fixture('{}', (_, dir) => {
    mkdirSync(join(dir, 'test'));
    const file = join(dir, 'test', 'sample.test.ts');
    const env = { ...process.env };
    delete env.NODE_TEST_CONTEXT;
    const cases = [
      { name: 'pass', body: "test('sample', () => {});", status: 0 },
      { name: 'fail', body: "test('sample', () => { throw new Error('sample'); });", status: 1 },
      { name: 'cancelled', body: "test('sample', { timeout: 1 }, () => new Promise(() => {}));", status: 1 },
      { name: 'crash', body: "throw new Error('sample');", status: 1 },
      { name: 'skip', body: "test('sample', t => { t.skip(); });", status: 1 },
      { name: 'todo', body: "test('sample', t => { t.todo(); });", status: 1 }
    ];
    for (const example of cases) {
      writeFileSync(file, "import { test } from 'node:test';\n" + example.body);
      const result = spawnSync(process.execPath, [gate], { cwd: dir, encoding: 'utf8', env });
      assert.equal(result.status, example.status, example.name + result.stderr);
    }
  });
});
