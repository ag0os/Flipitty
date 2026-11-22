import { test } from 'node:test';
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { loadFlags, type FlagSet } from '../src/flags.ts';
import { fixture } from './helpers.ts';

test('FL-1: evaluates the file boolean rules', () => {
  fixture('{"yes":true,"no":false}', path => {
    const flags = loadFlags(path);
    assert.equal(flags.isEnabled('yes'), true);
    assert.equal(flags.isEnabled('no'), false);
  });
});

test('FL-2: any absent name is off', () => {
  fixture('{}', path => {
    const flags = loadFlags(path);
    assert.equal(flags.isEnabled('missing'), false);
    assert.equal(flags.isEnabled('toString'), false);
  });
});

test('FL-3: invalid rules affect only their flag, file errors affect all', () => {
  for (const value of ['true', null, 5, [], {}]) {
    fixture(JSON.stringify({ good: true, bad: value }), path => {
      const flags = loadFlags(path);
      assert.equal(flags.isEnabled('good'), true);
      assert.throws(() => flags.isEnabled('bad'), error => {
        assert.match(String(error), /bad/);
        assert.ok(String(error).includes(path));
        return true;
      }, JSON.stringify(value));
    });
  }
  for (const body of ['{', 'null', '[]', 'true']) {
    fixture(body, path => {
      assert.throws(() => loadFlags(path), error => {
        assert.ok(String(error).includes(path));
        return true;
      });
    });
  }
  assert.throws(() => loadFlags('missing-file.json'), /missing-file.json/);
});

test('FL-4: loads a snapshot once, exposes names and accepts context', () => {
  fixture('{"yes":true,"no":false,"bad":5}', path => {
    const flags = loadFlags(path);
    writeFileSync(path, '{}');
    assert.deepEqual(flags.names(), ['yes', 'no', 'bad']);
    assert.equal(flags.has('yes'), true);
    assert.equal(flags.has('absent'), false);
    assert.equal(flags.isEnabled('yes', { user: 'example' }), true);
    assert.equal(flags.isEnabled('no', {}), false);
  });
});

test('FL-5: plain JSON permits BOM and excludes metadata names', () => {
  fixture('\uFEFF{"$schema":{},"on":true,"repeat":true,"repeat":false}', path => {
    const flags = loadFlags(path);
    assert.deepEqual(flags.names(), ['on', 'repeat']);
    assert.equal(flags.has('$schema'), false);
    assert.equal(flags.isEnabled('$schema'), false);
    assert.equal(flags.isEnabled('repeat'), false);
  });
});

test('FL-6: callers use a named flag set and object context', () => {
  const checkTypes = (flags: FlagSet) => {
    flags.isEnabled('on', { user: 'example' });
    // @ts-expect-error Context must be an object.
    flags.isEnabled('on', 'user');
    // @ts-expect-error Context must be an object.
    flags.isEnabled('on', 5);
  };
  assert.equal(typeof checkTypes, 'function');
});
