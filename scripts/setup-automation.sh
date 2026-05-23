#!/usr/bin/env bash
# One-time setup: GitHub repo + secrets for daily poopanthropists automation
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WEB="$ROOT/web"
ORG_ID="team_MYgs0Lp6iDYJDFksOckUEtuM"
PROJECT_ID="prj_9MMmxmbcpVWRi6OAbJ2RmbSxr4SF"

echo "=== PoopFare daily automation setup ==="

# 1. GitHub CLI auth
if ! gh auth status &>/dev/null; then
  echo ""
  echo "Step 1: Log in to GitHub (browser opens — approve access)"
  gh auth login -h github.com -p https -w
fi
GH_USER="$(gh api user -q .login)"
echo "✓ GitHub: $GH_USER"

# 2. Create repo and push
cd "$ROOT"
if ! git remote get-url origin &>/dev/null; then
  REPO_NAME="${1:-poopfare}"
  echo ""
  echo "Step 2: Creating github.com/$GH_USER/$REPO_NAME ..."
  gh repo create "$REPO_NAME" --public --source=. --remote=origin --push
else
  echo "✓ Remote: $(git remote get-url origin)"
  git push -u origin main 2>/dev/null || git push origin main
fi
REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner)"
echo "✓ Repo: https://github.com/$REPO"

# 3. Vercel secrets for GitHub Actions (CLI deploy — works without Git connect)
echo ""
echo "Step 3: Setting GitHub secrets for Vercel deploy..."
VERCEL_TOKEN="${VERCEL_TOKEN:-}"
if [[ -z "$VERCEL_TOKEN" && -f "$HOME/Library/Application Support/com.vercel.cli/auth.json" ]]; then
  VERCEL_TOKEN="$(node -e "console.log(JSON.parse(require('fs').readFileSync(process.argv[1])).token)" "$HOME/Library/Application Support/com.vercel.cli/auth.json")"
fi
if [[ -z "$VERCEL_TOKEN" ]]; then
  echo "Create a token at https://vercel.com/account/tokens and run:"
  echo "  VERCEL_TOKEN=xxx ./scripts/setup-automation.sh"
  exit 1
fi

gh secret set VERCEL_TOKEN --body "$VERCEL_TOKEN" --repo "$REPO"
gh secret set VERCEL_ORG_ID --body "$ORG_ID" --repo "$REPO"
gh secret set VERCEL_PROJECT_ID --body "$PROJECT_ID" --repo "$REPO"
echo "✓ VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID set"

# 4. Optional: deploy hook (needs Vercel ↔ Git connected)
echo ""
echo "Step 4: Connecting Vercel to GitHub (for deploy hooks)..."
cd "$WEB"
ORIGIN_URL="$(git -C "$ROOT" remote get-url origin)"
if npx vercel git connect "$ORIGIN_URL" --yes 2>/dev/null; then
  HOOK_JSON="$(npx vercel deploy-hooks create daily-poopanthropists --ref main --project poopfare --format json 2>/dev/null || true)"
  HOOK_URL="$(node -e "
    try {
      const j = JSON.parse(process.argv[1] || '{}');
      console.log(j.url || j.link || '');
    } catch { console.log(''); }
  " "$HOOK_JSON")"
  if [[ -n "$HOOK_URL" ]]; then
    gh secret set VERCEL_DEPLOY_HOOK --body "$HOOK_URL" --repo "$REPO"
    echo "✓ VERCEL_DEPLOY_HOOK set"
  fi
else
  echo "⚠ Git connect skipped — CLI deploy via VERCEL_TOKEN will still work"
fi

echo ""
echo "=== Done ==="
echo "• Repo: https://github.com/$REPO"
echo "• Site: https://poopfare.vercel.app"
echo "• Daily fetch: 00:30 UTC (~6 AM IST) via GitHub Actions"
echo ""
echo "Test now:"
echo "  gh workflow run daily-villains.yml --repo $REPO"
