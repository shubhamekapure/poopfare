#!/usr/bin/env bash
# One-time setup: GitHub repo + Vercel deploy hook + GitHub secret
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WEB="$ROOT/web"

echo "=== PoopFare automation setup ==="

# 1. GitHub CLI auth
if ! gh auth status &>/dev/null; then
  echo ""
  echo "Step 1: Log in to GitHub (browser will open)"
  gh auth login -h github.com -p https -w
fi
echo "✓ GitHub authenticated as $(gh api user -q .login)"

# 2. Create repo and push (skip if remote exists)
cd "$ROOT"
if ! git remote get-url origin &>/dev/null; then
  REPO_NAME="${1:-poopfare}"
  echo ""
  echo "Step 2: Creating GitHub repo: $REPO_NAME"
  gh repo create "$REPO_NAME" --public --source=. --remote=origin --push
else
  echo "✓ Git remote already set: $(git remote get-url origin)"
  git push -u origin main 2>/dev/null || git push origin main
fi

# 3. Connect Vercel to GitHub
cd "$WEB"
echo ""
echo "Step 3: Connecting Vercel project to GitHub..."
ORIGIN_URL="$(git -C "$ROOT" remote get-url origin)"
npx vercel git connect "$ORIGIN_URL" --yes 2>/dev/null || echo "(Git may already be connected)"

# 4. Create deploy hook
echo ""
echo "Step 4: Creating Vercel deploy hook..."
HOOK_JSON="$(npx vercel deploy-hooks create daily-poopanthropists --ref main --project poopfare --format json 2>/dev/null || npx vercel deploy-hooks ls --project poopfare --format json 2>/dev/null | node -e "
let d=''; process.stdin.on('data',c=>d+=c); process.stdin.on('end',()=>{
  const j=JSON.parse(d||'[]');
  const h=Array.isArray(j)?j.find(x=>x.name==='daily-poopanthropists'):j;
  if(h) console.log(JSON.stringify(h)); else process.exit(1);
});")"

HOOK_URL="$(node -e "const j=JSON.parse(process.argv[1]); console.log(j.url||j.link||'');" "$HOOK_JSON")"

if [[ -z "$HOOK_URL" ]]; then
  echo "✗ Could not create deploy hook. Create manually in Vercel → poopfare → Settings → Git → Deploy Hooks"
  exit 1
fi
echo "✓ Deploy hook: ${HOOK_URL:0:50}..."

# 5. Add GitHub secret
echo ""
echo "Step 5: Adding VERCEL_DEPLOY_HOOK secret to GitHub..."
gh secret set VERCEL_DEPLOY_HOOK --body "$HOOK_URL" --repo "$(gh repo view --json nameWithOwner -q .nameWithOwner)"

echo ""
echo "=== Done ==="
echo "• GitHub repo pushed"
echo "• Vercel deploy hook created"
echo "• VERCEL_DEPLOY_HOOK secret set"
echo ""
echo "Daily workflow runs at 00:30 UTC (~6 AM IST)."
echo "Test now: gh workflow run daily-villains.yml"
