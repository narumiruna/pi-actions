# Pi GitHub Actions

Review pull requests and classify issues with
[pi-coding-agent](https://github.com/earendil-works/pi). Rebase outdated pull
request branches with GitHub.

| Action                               | Purpose                                                                 | Documentation                               |
| ------------------------------------ | ----------------------------------------------------------------------- | ------------------------------------------- |
| `narumiruna/pi-actions/review`       | Review a diff, post findings, and resolve verified fixes.               | [Review guide](review/README.md)            |
| `narumiruna/pi-actions/triage`       | Classify an issue and add existing repository labels.                   | [Triage guide](triage/README.md)            |
| `narumiruna/pi-actions/rebase`       | Rebase outdated pull request branches without a checkout.               | [Rebase guide](rebase/README.md)            |
| `narumiruna/pi-actions/persist-auth` | Save already-refreshed OAuth credentials from a private temporary file. | [Persistence guide](persist-auth/README.md) |

## OAuth credentials

Review and triage support opt-in persistence of refreshed OAuth credentials to an
existing GitHub Actions environment secret in the caller repository. Use the
supported inline inputs to save before publication, or use `auth-output` with a
separate [persist-auth step](persist-auth/README.md). The separate step reuses
`PAT_TOKEN` without giving the writer token to review or triage. Its preflight
runs after Pi, and a failed save cannot undo published comments or labels.

Follow the [OAuth setup and migration guide](docs/oauth.md) for writer permissions, the shared
job lock, recovery, and required live checks. Owner setup and a reviewed action
revision are required before activation. Other repositories must use a published,
pinned revision. API-key examples are unchanged.

## Development

The review, triage, and rebase workflows check out the trusted `${{ github.sha }}`
with `persist-credentials: false`, then use local paths: `./review`, `./triage`,
`./rebase`, and `./persist-auth`. They never check out the pull request head.
Examples in the action guides use published revisions for other repositories.

Use Node.js 26, as in CI, and run:

```sh
npm ci
npm run ci
```

The package is private and does not expose a supported npm library API.

| Path                                                                                     | Purpose                                                 |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `review/action.yml`, `triage/action.yml`, `rebase/action.yml`, `persist-auth/action.yml` | Composite action manifests.                             |
| `src/`                                                                                   | TypeScript runtime for the actions and shared Pi setup. |
| `dist/`                                                                                  | Compiled ESM JavaScript used by the actions.            |
| `.pi/prompts/`                                                                           | Bundled review and triage prompts.                      |
| `tests/`                                                                                 | Runtime, workflow, and distribution tests.              |
| `scripts/`                                                                               | Development scripts.                                    |

`npm run build` compiles the runtime with strict type checks. `npm test` builds
before running tests against the compiled files. `npm run ci` runs the code
checks, tests, and build.

Commit `dist/*.js` with every source change. Do not edit generated JavaScript
directly. CI rebuilds the action and rejects changed or untracked files in
`dist/`. Action users do not need a checkout, development dependencies, or a local
build when they use the bundled prompts.

Distribution tests run each manifest command from a copied action directory
containing only `dist/`, `package.json`, the action subdirectory, and any required
bundled prompts. They also check missing runtime modules and prompts.

### Verify in GitHub

Local tests mock Pi and GitHub. Follow the action-specific guides to verify live
behavior:

- [Review verification](review/README.md#verify-in-github)
- [Triage verification](triage/README.md#verify-in-github)
- [Rebase verification](rebase/README.md#verify-in-github)
- [Persistence verification](docs/oauth.md#external-verification-handoff)
