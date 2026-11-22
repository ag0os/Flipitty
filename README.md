# Flipitty

A feature flag library and command over a JSON file. It runs from a checkout on Node 24 and is not an installable package yet.

```sh
mise exec -- ./src/cli.ts eval newCheckout
# true, status 0 when on
# false, status 1 when off
```

Use `--file PATH` before or after the name to select another file. The default is `./flags.json`. An absent name answers false with status 1 and a warning on stderr. Usage, file and rule errors exit 2 with a diagnostic on stderr and no answer. `--help` explains the command and statuses.

Load once, then query the snapshot:

```ts
import { loadFlags, type FlagSet } from './src/flags.ts';

const flags: FlagSet = loadFlags('flags.json');
flags.isEnabled('newCheckout'); // true
flags.isEnabled('search', { user: 'example' }); // false
flags.names(); // ['newCheckout', 'search']
flags.has('search'); // true
```

Context is an optional object; boolean rules ignore it. Reload explicitly to observe file changes. Unsupported values report an error when that flag is evaluated, without affecting other flags. File-level errors prevent loading. Later rule kinds add an evaluator and a dispatch branch in src/flags.ts without changing callers.

The file is plain JSON. A leading UTF-8 byte order mark is accepted, and a repeated key takes its last value. Boolean values are the only rule kind supported today:

```json
{"newCheckout": true, "search": false}
```

Top-level names starting with `$` are reserved for metadata. They are excluded from `names()` and treated as absent flags.

To work on the checkout, run `mise install`, `mise exec -- npm ci`, then `mise exec -- npm run check`. See [AGENTS.md](AGENTS.md), the [Contract](docs/contract.md), and [adoption notes](docs/method-adoption.md). Licensed under [MIT](LICENSE).
