#!/usr/bin/env bash
#
# Wire up the repo's git hooks for this clone. Run once per machine/clone
# (core.hooksPath is local config and is not committed):
#
#   ./scripts/dev/install-git-hooks.sh
#
# After this, every `git push` runs scripts/dev/validate.sh first.
#
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$repo_root"

chmod +x .githooks/* 2>/dev/null || true
git config core.hooksPath .githooks

echo "core.hooksPath -> $(git config core.hooksPath)"
echo "pre-push now runs scripts/dev/validate.sh before each push."
