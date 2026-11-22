import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

export function fixture(body: string, run: (path: string, dir: string) => void) {
  const dir = mkdtempSync(join(tmpdir(), 'flipitty-'));
  try {
    const path = join(dir, 'flags.json');
    writeFileSync(path, body);
    run(path, dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

export function cli(args: string[], cwd: string) {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  const executable = resolve(pkg.bin.flipitty);
  assertExecutable(executable);
  return spawnSync(executable, args, { cwd, encoding: 'utf8' });
}

function assertExecutable(path: string) {
  if (!readFileSync(path, 'utf8').startsWith('#!/usr/bin/env node\n')) {
    throw new Error('Missing Node shebang');
  }
}
