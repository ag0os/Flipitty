import { test } from 'node:test';
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fixture, cli } from './helpers.ts';

test('CLI-1: flipitty eval reports the selected file library value', () => {
  fixture('{"yes":false,"no":true}', (_, dir) => {
    const selected = join(dir, 'other.json');
    writeFileSync(selected, '{"yes":true,"no":false}');
    for (const [flag, value, status] of [['yes', 'true', 0], ['no', 'false', 1]] as const) {
      const result = cli(['eval', flag, '--file', selected], dir);
      assert.equal(result.error, undefined);
      assert.equal(result.status, status);
      assert.equal(result.stdout, `${value}\n`);
      assert.equal(result.stderr, '');
    }
  });
});

test('CLI-2: answer statuses differ from usage, file and rule errors', () => {
  fixture('{"on":true,"off":false,"bad":5}', (path, dir) => {
    for (const [flag, status] of [['on', 0], ['off', 1]] as const) {
      const result = cli(['eval', flag], dir);
      assert.equal(result.status, status);
      assert.equal(result.stdout, `${status === 0}\n`);
      assert.equal(result.stderr, '');
    }
    const invalidArguments = [
      [],
      ['list'],
      ['eval'],
      ['eval', 'on', '--file'],
      ['eval', 'on', 'extra'],
      ['eval', 'on', '--file', path, 'extra'],
      ['eval', 'on', '--file', 'missing.json'],
      ['eval', 'bad']
    ];
    for (const args of invalidArguments) {
      const result = cli(args, dir);
      assert.equal(result.status, 2, JSON.stringify(args));
      assert.equal(result.stdout, '');
      assert.ok(result.stderr.trim());
    }
    writeFileSync(path, '{');
    assert.equal(cli(['eval', 'on'], dir).status, 2);
  });
});

test('CLI-3: absent flag is off with a warning naming flag and file', () => {
  fixture('{}', (path, dir) => {
    const result = cli(['eval', 'missing'], dir);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, 'false\n');
    assert.match(result.stderr, /Warning/);
    assert.match(result.stderr, /missing/);
    assert.ok(result.stderr.includes(path));
  });
});

test('CLI-4: file option order, help and contextual diagnostics', () => {
  fixture('{"on":true,"bad":5}', (path, dir) => {
    assert.equal(cli(['eval', '--file', path, 'on'], dir).status, 0);
    for (const args of [['--help'], ['eval', '--help'], ['eval', '-h']]) {
      const result = cli(args, dir);
      assert.equal(result.status, 0);
      assert.match(result.stdout, /Usage: flipitty eval/);
      assert.equal(result.stderr, '');
    }
    for (const [flag, file] of [['bad', path], ['on', 'missing.json']] as const) {
      const result = cli(['eval', flag, '--file', file], dir);
      assert.equal(result.status, 2);
      assert.ok(result.stderr.includes(flag));
      assert.ok(result.stderr.includes(file));
    }
  });
});

test('CLI-5: diagnostics are concise and separate usage from file errors', () => {
  fixture('{"bad":5}', (path, dir) => {
    const mistakes = [
      { args: ['evl', 'on'], words: ['unknown command', 'evl'] },
      { args: ['eval'], words: ['missing', 'flag'] },
      { args: ['eval', 'on', 'extra'], words: ['extra', 'argument'] },
      { args: ['eval', 'on', '--fiel'], words: ['unknown option', '--fiel'] },
      { args: ['eval', 'on', '--file'], words: ['--file', 'value'] }
    ];
    for (const { args, words } of mistakes) {
      const result = cli(args, dir);
      assert.equal(result.status, 2, args.join(' '));
      assert.equal(result.stdout, '');
      assert.match(result.stderr, /^flipitty: /);
      assert.match(result.stderr, /Usage: flipitty eval/);
      assert.ok(!result.stderr.includes(path));
      assert.doesNotMatch(result.stderr, /ERR_|Error:|TypeError|positional argument starting/);
      for (const word of words) {
        assert.ok(result.stderr.includes(word), word);
      }
    }
    for (const file of ['missing.json', path]) {
      const result = cli(['eval', 'bad', '--file', file], dir);
      assert.equal(result.status, 2);
      assert.equal(result.stdout, '');
      assert.equal(result.stderr.trim().split('\n').length, 1);
      assert.match(result.stderr, /^flipitty: /);
      assert.doesNotMatch(result.stderr, /Error:|ENOENT|ERR_/);
      assert.equal(result.stderr.split(file).length - 1, 1);
      if (file === path) {
        assert.match(result.stderr, /bad/);
        assert.match(result.stderr, /5/);
        assert.match(result.stderr, /boolean/);
      }
    }
    writeFileSync(path, '{');
    const malformed = cli(['eval', 'on'], dir);
    assert.equal(malformed.status, 2);
    assert.equal(malformed.stderr.trim().split('\n').length, 1);
    assert.equal(malformed.stderr.split(path).length - 1, 1);
    assert.doesNotMatch(malformed.stderr, /SyntaxError|Error:/);
    writeFileSync(path, '{\n  "on": true,\n}');
    const misplaced = cli(['eval', 'on'], dir);
    assert.equal(misplaced.status, 2);
    assert.equal(misplaced.stderr.trim().split('\n').length, 1);
    assert.match(misplaced.stderr, /line 3 column 1\b/);
    writeFileSync(path, '{}');
    const absent = cli(['eval', 'missing'], dir);
    assert.match(absent.stderr, /^flipitty: /);
  });
});

test('CLI-6: help explains answers, statuses and default file', () => {
  fixture('{}', (_, dir) => {
    const result = cli(['--help'], dir);
    assert.equal(result.status, 0);
    assert.equal(result.stderr, '');
    for (const word of ['Usage:', 'true', 'false', '0', '1', '2', './flags.json', '--file']) {
      assert.ok(result.stdout.includes(word), word);
    }
    assert.ok(result.stdout.trim().split('\n').length >= 3);

    const bare = cli([], dir);
    assert.equal(bare.status, 2);
    assert.equal(bare.stdout, '');
    assert.match(bare.stderr, /^flipitty: missing command\n/);
    assert.ok(bare.stderr.includes(result.stdout));
  });
});
