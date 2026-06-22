#!/usr/bin/env bash
#
# Local validation — mirrors what the cloud CI `validate` job used to run.
# This is the gate now that CI is manual-only (.github/workflows/ci.yml).
# Enforced automatically before every push by .githooks/pre-push.
#
# Run manually any time:  ./scripts/dev/validate.sh
#
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$repo_root"

export NEXT_TELEMETRY_DISABLED=1

failed=0
section() { printf '\n=== %s ===\n' "$*"; }

section "install (frozen lockfile)"; pnpm install --frozen-lockfile || failed=1
section "lint";                      pnpm lint                       || failed=1
section "typecheck";                 pnpm typecheck                  || failed=1
section "build";                     pnpm build                      || failed=1

if [ "$failed" -ne 0 ]; then
  echo -e "\nVALIDATION FAILED" >&2
  exit 1
fi

echo -e "\nValidation passed."
echo "Note: e2e tests are not part of this gate (they weren't in CI either)."
echo "Run 'pnpm test:e2e' manually when touching pages, navigation, or the contact flow."
