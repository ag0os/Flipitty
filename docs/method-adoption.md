# Method adoption, 2026-11-25

Adopts [Impatient Programming v2.0](https://github.com/ag0os/method-imp/tree/v2.0). Local verification is `npm run check`. Initial creation on main is authorized; no standing merge grant exists.

- CN-1: Contract ids, statements, reasons, provenance and named live proofs are checked; counts are computed. Non-functional budgets and retirement are supported.
- CN-4: new behavior requires an observed red before implementation, then green; existing behavior is recorded as present. An independent read is required or named as missing.
- CN-8: AGENTS.md carries Contract format, evidence requirements, labels, bug order and toolchain commands.
- CK-1: types, all tests, lint and fallow analyses share one command with unconditional Linux CI wiring. The test gate fails when the test runner exits with a failure status or reports failed, cancelled, skipped or todo tests.
- CK-2: every presentation names required checks that could not run or remain absent.
- CK-3: mutation is advisory, outside the checks command; use the all-source side-effects-enabled command in AGENTS.md. Red regression tests remain the fallback for subprocess behavior.
- CK-4: first baseline is zero dead-code, complexity and duplicate findings. The current gate enforces absolute zero; later changes require a merge-base comparison and reasoned inherited debt.
- BD-4: proposed integration limit is one day or the shorter agreement period, excluding time waiting for acceptance; update the base before resuming.
- MG-5: fix labels name a live production defect and obligation; other work uses refine.

Known gaps:

- Hosted Linux CI has not run; action runtime compatibility is unverified.
- A fresh-session production-bug exercise has not run.
- Independent review of this final change remains outstanding.
- Mutation has no complete merge-base survivor comparison; subprocess CLI execution lacks attributed coverage.
- Automated merge-base health/debt comparison and guards on fallow configuration or health-policy changes are missing.
- Historical obligation deletions, retired-id reuse and status flips are not compared against a base.
- Type settings can be weakened with overrides, excludes or per-file suppressions despite the existing partial configuration checks.
- Lint's status, kind and budget enforcement is not itself fault-proved by TOOL-1.
- The shared fixture helper can suppress callbacks without an independent guard.
- Proof kinds other than tests are not supported by the lint.
- The package exports target is not validated for consumption; use remains checkout-only.
- JavaScript tooling unused locals, assertion quality and clones below fallow thresholds require review.
- Branch-age and commit-label enforcement remains manual.

TypeScript remains pinned to 5.9.3. Fallow 3.46.0 uses static estimated coverage, which does not prove runtime coverage; architecture boundaries and policy packs are not configured. No accepted exception to a missing method obligation is claimed.

2026-11-25: `.fallowrc.json` declares `test/*.test.ts` as test entry points and nothing else. The test gate script now starts `node --test` itself, and fallow finds test files only in a package script that begins with `node --test`; without the declaration it reported every test file as unused and estimated no test coverage.
