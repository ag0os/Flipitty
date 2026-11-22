import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

test('TOOL-1: lint resolves live proofs and accepts retirement and budgets', () => {
  const dir = mkdtempSync(join(tmpdir(), 'flipitty-lint-'));
  const script = resolve('scripts/contract-lint.mjs');
  const contract = `# Contract
### NEW-1 Sample
Status: discovered proposal
Kind: non-functional; budget: 1 second, measured by test
Statement: Completes in budget.
Reason: Keep response quick.
Proof: test 'NEW-1' in test/new.test.ts.
### OLD-1 Retired 2026-11-22, merged into NEW-1.
`;
  try {
    mkdirSync(join(dir, 'docs'));
    mkdirSync(join(dir, 'test'));
    const run = (text: string, source: string) => {
      writeFileSync(join(dir, 'docs/contract.md'), text);
      writeFileSync(join(dir, 'test/new.test.ts'), source);
      return spawnSync(process.execPath, [script], { cwd: dir, encoding: 'utf8' });
    };
    const live = "test('NEW-1: works', () => { assert.equal(1, 1); });";
    const valid = run(contract, live);
    assert.equal(valid.status, 0, valid.stderr);
    assert.match(valid.stdout, /1 active, 1 retired, 1 test proofs/);
    const invalidProofs = [
      { name: 'commented proof', source: '// ' + live },
      { name: 'skipped proof', source: "test.skip('NEW-1', () => {});" },
      { name: 'skip options', source: "test('NEW-1', { skip: true }, () => {});" },
      { name: 'empty proof', source: "test('NEW-1', () => {});" }
    ];
    for (const example of invalidProofs) {
      assert.notEqual(run(contract, example.source).status, 0, example.name);
    }
    const invalidContracts = [
      { name: 'missing statement', text: contract.replace('Statement: Completes in budget.', '') },
      { name: 'missing test file', text: contract.replace('test/new.test.ts', 'test/missing.test.ts') },
      { name: 'missing reason', text: contract.replace('Reason: Keep response quick.', '') },
      { name: 'duplicate id', text: contract + contract }
    ];
    for (const example of invalidContracts) {
      assert.notEqual(run(example.text, live).status, 0, example.name);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
