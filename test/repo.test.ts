import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('REPO-1: checks and unconditional Linux CI match the pinned toolchain', () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  assert.deepEqual(pkg.scripts, {
    check: 'npm run types && npm test && npm run contract && npm run health',
    types: 'tsc --noEmit',
    test: 'node --test --test-reporter=tap test/*.test.ts | node scripts/test-runner.mjs',
    contract: 'node scripts/contract-lint.mjs',
    health: 'node scripts/health.mjs'
  });
  const version = readFileSync('mise.toml', 'utf8').match(/^node = "([^"]+)"$/m)?.[1];
  assert.ok(version);
  assert.equal(pkg.engines.node, `>=${version} <25`);
  assert.equal(readFileSync('.github/workflows/check.yml', 'utf8'), `name: Checks
on:
  pull_request:
  push:
    branches: [main]
permissions:
  contents: read
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          persist-credentials: false
      - uses: actions/setup-node@v4
        with:
          node-version: '${version}'
          cache: npm
      - run: npm ci
      - run: npm run check
`);
  const config = JSON.parse(readFileSync('tsconfig.json', 'utf8'));
  assert.equal(config.compilerOptions.strict, true);
  assert.equal(config.compilerOptions.noUnusedLocals, true);
  assert.equal(config.compilerOptions.noUnusedParameters, true);
  assert.deepEqual(config.include, ['src/**/*.ts', 'test/**/*.ts']);
});
