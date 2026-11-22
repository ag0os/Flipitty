import { spawnSync } from 'node:child_process';

for (const kind of ['dead-code', 'health', 'dupes']) {
  const result = spawnSync('node_modules/.bin/fallow', [
    kind,
    '--format', 'json',
    '--quiet',
    '--explain',
    '--no-cache'
  ], {
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024
  });
  if (result.error || ![0, 1].includes(result.status)) {
    throw Error(`Fallow ${kind} failed: ${result.stderr}`);
  }
  const report = JSON.parse(result.stdout);
  let count;
  switch (kind) {
    case 'dead-code':
      count = report.total_issues;
      break;
    case 'health':
      count = report.findings.length;
      break;
    case 'dupes':
      count = report.clone_groups.length;
      break;
  }
  if (typeof count !== 'number') {
    throw Error(`Unknown ${kind} report`);
  }
  console.log(`${kind}: ${count} findings`);
  if (count) {
    process.exitCode = 1;
  }
}
