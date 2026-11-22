import { readFileSync, readdirSync } from 'node:fs';
import ts from 'typescript';

const proofs = new Map();
for (const file of readdirSync('test').filter(name => name.endsWith('.test.ts'))) {
  const path = `test/${file}`;
  const source = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true);
  const names = new Set();
  for (const statement of source.statements) {
    if (!ts.isExpressionStatement(statement) || !ts.isCallExpression(statement.expression)) {
      continue;
    }
    const call = statement.expression;
    if (call.expression.getText(source) !== 'test' || call.arguments.length !== 2) {
      continue;
    }
    const [name, body] = call.arguments;
    if (!ts.isStringLiteral(name) || !ts.isArrowFunction(body) ||
        !ts.isBlock(body.body) || !body.body.statements.length) {
      continue;
    }
    names.add(name.text.split(':')[0]);
  }
  proofs.set(path, names);
}

const text = readFileSync('docs/contract.md', 'utf8');
const sections = text.split(/^### /m).slice(1);
const seen = new Set();
let active = 0;
let retired = 0;
let testProofs = 0;
if (!sections.length) {
  throw Error('No obligations');
}
for (const section of sections) {
  const id = section.match(/^([A-Z]+-\d+) /)?.[1];
  if (!id || seen.has(id)) {
    throw Error('Missing or reused id');
  }
  seen.add(id);
  if (/^[A-Z]+-\d+ Retired \d{4}-\d{2}-\d{2},/.test(section)) {
    retired++;
    continue;
  }
  active++;
  for (const field of ['Statement', 'Reason']) {
    if (!new RegExp(`^${field}: \\S`, 'm').test(section)) {
      throw Error(`${id}: missing ${field}`);
    }
  }
  if (!/^Status: (agreed|discovered proposal)$/m.test(section)) {
    throw Error(`${id}: missing status`);
  }
  if (!/^Kind: (functional|non-functional)/m.test(section)) {
    throw Error(`${id}: missing kind`);
  }
  if (/^Kind: non-functional/m.test(section) && !/^Kind: .*budget: .+measured by .+/m.test(section)) {
    throw Error(`${id}: missing budget or measurement`);
  }
  const proof = section.match(/^Proof: test '([^']+)' in (test\/[^\s]+\.test\.ts)\.$/m);
  if (!proof || proof[1] !== id || !proofs.get(proof[2])?.has(id)) {
    throw Error(`${id}: missing live named test`);
  }
  testProofs++;
}
console.log(`Contract lint: ${active} active, ${retired} retired, ${testProofs} test proofs, ${active - testProofs} unproved`);
