# Check evidence, 2026-11-25

| Id or check | Red observed | Green observed | Named violation rejected |
| --- | --- | --- | --- |
| FL-1, FL-2 | Already present | 2026-11-25 | Always-off rule; absent name enabled |
| FL-3 | Already present; invalid-kind cases expanded | 2026-11-25 | Accept string, null, number, array or object as a rule |
| FL-4 | Already present | 2026-11-25 | Snapshot behavior covered by existing test |
| FL-5 | 2026-11-25 19:01:04 UTC: BOM rejected | 2026-11-25 | BOM rejected; metadata treated as flags |
| FL-6 | 2026-11-25 19:01:04 UTC: missing FlagSet and unused type-error directives | 2026-11-25 | Non-object context accepted by types |
| CLI-1 through CLI-4 | Already present | 2026-11-25 | Existing executable, status and file-selection assertions retained |
| CLI-5 | 2026-11-25 19:01:04 UTC: old nested diagnostic prefix | 2026-11-25 | Runtime prefix exposed; file blamed for usage |
| CLI-6 | 2026-11-25 19:01:04 UTC: help lacks answer explanation | 2026-11-25 | Single-line help omits statuses/default |
| CLI-5, parse position | 2026-11-25 19:13:07 UTC: malformed file reported without a position | 2026-11-25 | Position dropped from the diagnostic |
| CLI-5, option values | 2026-11-25 20:43:37 UTC: empty --file reported the current directory as an unreadable file; 20:43:49 UTC: --help=x named --file; 22:22:25 UTC: --file -- --help=x named --help; 22:22:44 UTC: --help=x --help named --file | 2026-11-25 | Usage mistake shown as a file error; wrong option named |
| CLI-5, file error reasons | 2026-11-25 22:25:25 to 22:25:33 UTC: each named violation, applied to the unchanged product, failed the strengthened proof | 2026-11-25 | Directory reported as invalid JSON or as missing; empty reason for a missing or unreadable file |
| CLI-5, reason true to cause | 2026-11-26 14:34:00 and 14:34:17 UTC: the two read reasons swapped, and a directory reported as missing, each applied to the unchanged product, failed the strengthened proof | 2026-11-26 | Missing file not reported as missing; directory reported as missing |
| CLI-5, usage diagnostic line | 2026-11-25 22:25:36 UTC: an extra-argument diagnostic naming flags.json, applied to the unchanged product, failed the strengthened proof | 2026-11-25 | Usage diagnostic names a flags file |
| CLI-6, no command | 2026-11-25 19:12:30 UTC: bare command reported as unknown command "" | 2026-11-25 | Help omitted when no command is given |
| CLI-3 to CLI-6, FL-4, assertion strength | 2026-11-25 20:42:18 to 20:42:50 UTC: each named violation, applied to the unchanged product, failed its proof | 2026-11-25 | Help pairing statuses with the wrong answers; usage word present only in the help; found value matched only in the path; directory reported as missing; extra command alias or empty name accepted; warning dropped for some names; presence wrong for prototype or long names |
| REPO-1 | Existing proof updated for test gate | 2026-11-25 | Exact command wiring checked |
| TOOL-1 | Already present | 2026-11-25 | Existing labelled malformed-proof and Contract cases retained |
| TOOL-2 | 2026-11-25 19:01:04 UTC: missing test gate | 2026-11-25 | Actual skipped and todo test reports |
| TOOL-2, runner status | 2026-11-25 22:20:19 UTC: the gate script did not start the test runner, so it failed the passing sample | 2026-11-25 | Failing, cancelled, crashing, skipped and todo samples run through the real gate script |
| REPO-1, test gate wiring | 2026-11-25 22:20:19 UTC: the test script still piped the runner into the gate | 2026-11-25 | Test script other than the plain gate script |
| TOOL-2, no tests | 2026-11-26 14:32:59 UTC: the gate passed a run in which no test file matched | 2026-11-26 | Run with no tests |
| REPO-1, test file pattern | 2026-11-26 14:33:23 UTC: a narrowed gate pattern, applied to the unchanged product, failed the strengthened proof | 2026-11-26 | Gate runs other than test/*.test.ts |
| Types and health | Existing checks | 2026-11-25 | Context type widening; existing zero-finding boundary retained |

Node v24.22.3 was recorded in each new raw run. New reds were inspected in a separate step before implementation. Raw logs are not committed; each change record must include a short red excerpt with time, Node version, failing test and reason. The table describes the declared proof boundary, not complete system coverage.
