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
| CLI-6, no command | 2026-11-25 19:12:30 UTC: bare command reported as unknown command "" | 2026-11-25 | Help omitted when no command is given |
| REPO-1 | Existing proof updated for test gate | 2026-11-25 | Exact command wiring checked |
| TOOL-1 | Already present | 2026-11-25 | Existing labelled malformed-proof and Contract cases retained |
| TOOL-2 | 2026-11-25 19:01:04 UTC: missing test gate | 2026-11-25 | Actual skipped and todo test reports |
| Types and health | Existing checks | 2026-11-25 | Context type widening; existing zero-finding boundary retained |

Node v24.22.3 was recorded in each new raw run. New reds were inspected in a separate step before implementation. Raw logs are not committed; each change record must include a short red excerpt with time, Node version, failing test and reason. The table describes the declared proof boundary, not complete system coverage.
