#!/bin/bash
# Vercel Ignored Build Step
# Skips build if no files changed for this specific store
#
# Set this in Vercel project settings:
#   Settings -> Git -> Ignored Build Step
#   Command: bash check-store-changes.sh
#
# Each Vercel project must have NEXT_PUBLIC_STORE_ID set (e.g. s1, s2)

STORE_ID="${NEXT_PUBLIC_STORE_ID:-s1}"

echo "Checking for changes affecting store: $STORE_ID"

# Get list of changed files in this commit
CHANGED=$(git diff HEAD~1 --name-only 2>/dev/null || git diff --name-only HEAD 2>/dev/null || echo "")

echo "Changed files:"
echo "$CHANGED"

# Always rebuild if core code changed (not store-specific assets)
CORE_CHANGED=$(echo "$CHANGED" | grep -v "^public/assets/stores/" | grep -v "^public/policies/" | grep -c "" || true)

if [ "$CORE_CHANGED" -gt "0" ]; then
  echo "Core code changed — rebuilding all stores"
  exit 1  # 1 = proceed with build
fi

# Check if this store's specific assets changed
STORE_CHANGED=$(echo "$CHANGED" | grep -E "^public/assets/stores/${STORE_ID}/|^public/policies/${STORE_ID}_" | grep -c "" || true)

if [ "$STORE_CHANGED" -gt "0" ]; then
  echo "Store $STORE_ID assets changed — rebuilding"
  exit 1  # 1 = proceed with build
fi

echo "No changes for store $STORE_ID — skipping build"
exit 0  # 0 = skip build
