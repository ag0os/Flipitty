# Flipitty Contract

2026-11-22. Covers file loading, rule evaluation, command behavior and verification. The lint computes proof counts. Coverage beyond these obligations is unknown. Discovered proposals await owner acceptance.

### FL-1 Boolean evaluation
Status: agreed
Kind: functional
Statement: Given a flags file, the library says a flag the file sets on is on, and a flag the file sets off is off.
Reason: Application code needs the configuration's enablement decision.
Proof: test 'FL-1' in test/flags.test.ts.

### FL-2 Absent names
Status: agreed
Kind: functional
Statement: A name the file does not set is off.
Reason: Missing configuration must not enable unfinished functionality.
Proof: test 'FL-2' in test/flags.test.ts.

### FL-3 Input errors
Status: agreed
Kind: functional
Statement: An unknown rule kind is an error for that flag only, reported when the flag is evaluated; an unreadable file, invalid JSON or a non-object root is an error for every flag.
Reason: Invalid rules must not prevent valid neighbors from evaluating, while a broken file cannot provide flags.
Proof: test 'FL-3' in test/flags.test.ts.

### FL-4 Loaded flag set
Status: discovered proposal
Kind: functional
Statement: Loading produces a snapshot that supports repeated boolean queries with optional context, enumerating all names and checking name presence without reading the file again. Boolean rules ignore context. This version recognizes only boolean rules.
Reason: Callers should load once; later commands need the same names and later rule evaluators need context without changing callers.
Proof: test 'FL-4' in test/flags.test.ts.

### CLI-1 Evaluation command
Status: agreed
Kind: functional
Statement: `flipitty eval <flag>` reports for that flag what the library says, read from the flags file.
Reason: Shell callers need access to the same decision as application code.
Proof: test 'CLI-1' in test/cli.test.ts.

### CLI-2 Answers and statuses
Status: agreed
Kind: functional
Statement: The command prints `true` or `false` and its exit status carries the answer: 0 when the flag is on, 1 when it is off, 2 on an error (bad usage, an unreadable or invalid file, an invalid value for the flag).
Reason: Shell conditionals must distinguish on, off and a failed evaluation.
Proof: test 'CLI-2' in test/cli.test.ts.

### CLI-3 Unknown-name warning
Status: agreed
Kind: functional
Statement: For a name the file does not set, the command answers off (prints `false`, status 1) and writes a warning to stderr that names the flag.
Reason: A safe off fallback should still reveal a likely typo to the operator.
Proof: test 'CLI-3' in test/cli.test.ts.

### CLI-4 Arguments and help
Status: discovered proposal
Kind: functional
Statement: Use flags.json in the current directory by default. Accept --file PATH before or after the flag name. --help and -h print usage with status 0 and empty stderr, including after eval. Accept only eval with one nonempty name; extra positionals are errors.
Reason: Predictable argument selection and contextual diagnostics make the command usable interactively and in scripts.
Proof: test 'CLI-4' in test/cli.test.ts.

### REPO-1 Verification entry point
Status: discovered proposal
Kind: functional
Statement: One fail-fast verification command covers strict types including unused locals and parameters, all tests, Contract lint and health. Unconditional Linux CI installs dependencies and runs that command on every pull request and push to main using the pinned Node version.
Reason: A shared verification boundary must not silently omit its guards.
Proof: test 'REPO-1' in test/repo.test.ts.

### TOOL-1 Executable proof references
Status: discovered proposal
Kind: functional
Statement: Contract lint requires unique ids, statements, reasons, provenance, kinds and live named proofs in their specified test files. It accepts retired obligations without proofs and non-functional obligations with budgets and measurement, and computes active, retired and proof counts.
Reason: A missing or disabled proof must not masquerade as a verified promise, and new test files must remain usable.
Proof: test 'TOOL-1' in test/lint.test.ts.

### FL-5 Plain JSON and metadata
Status: discovered proposal
Kind: functional
Statement: The file is plain JSON, permits a leading UTF-8 byte order mark and uses the last value of a repeated key. Names beginning with $ are metadata, excluded from names and evaluated as absent.
Reason: Editor metadata and common text encodings must not become flags or block loading.
Proof: test 'FL-5' in test/flags.test.ts.

### FL-6 Library context type
Status: discovered proposal
Kind: functional
Statement: The flag set has a named public type and evaluation context is an optional object, not a string or number.
Reason: Callers need a reusable type and a stable context boundary for later evaluators.
Proof: test 'FL-6' in test/flags.test.ts.

### CLI-5 Diagnostics and output streams
Status: discovered proposal
Kind: functional
Statement: Answers end with a newline. Errors have empty stdout and diagnostics on stderr; present valid flags have empty stderr. Each diagnostic begins with flipitty:. Usage mistakes identify the mistake, name no flags file and are followed by the help text. File errors name the file once and a plain reason; a file that is not valid JSON also says where parsing stopped, when the parser reports a position. Rule errors name the flag and file once, describe the value and expected boolean. Absent-name warnings also name the file. No nested error prefixes or internal runtime codes are exposed. Exact wording is unspecified.
Reason: Operators need to distinguish incorrect invocation from broken data without repeated paths or runtime jargon.
Proof: test 'CLI-5' in test/cli.test.ts.

### CLI-6 Explanatory help
Status: discovered proposal
Kind: functional
Statement: Help contains usage, the true or false answer, statuses 0, 1 and 2, and the ./flags.json default unless --file is supplied. Run with no command, that help follows a missing-command diagnostic on stderr, with status 2 and empty stdout.
Reason: Shell users need to understand the answer and status convention before scripting.
Proof: test 'CLI-6' in test/cli.test.ts.

### TOOL-2 No omitted tests
Status: discovered proposal
Kind: functional
Statement: The test gate fails if the runner reports any skipped or todo test.
Reason: An omitted proof must not silently count as verification.
Proof: test 'TOOL-2' in test/runner.test.ts.
