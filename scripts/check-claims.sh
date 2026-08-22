#!/usr/bin/env bash
# Fails if any unsourced claim listed in scripts/banned-claims.txt appears in public copy.
# WHY: every number on this site must trace to a row in EVIDENCE-LEDGER.md. This guard is
# what keeps that true after the rebuild is archived and forgotten.
set -uo pipefail
cd "$(dirname "$0")/.."

PATTERNS="scripts/banned-claims.txt"
# EVIDENCE-LEDGER.md is deliberately NOT scanned: it records the held-back claims verbatim.
FILES=$(git ls-files 'index.html' 'projects/*.html' 'resume_data.json' 'README.md')

if [ -z "$FILES" ]; then
  echo "check-claims: no content files found — is this the repo root?" >&2
  exit 2
fi

fail=0
while IFS= read -r pattern || [ -n "$pattern" ]; do
  case "$pattern" in ''|\#*) continue ;; esac
  if matches=$(grep -REn -- "$pattern" $FILES 2>/dev/null); then
    echo "BANNED CLAIM  /$pattern/"
    printf '%s\n' "$matches" | sed 's/^/    /'
    fail=1
  fi
done < "$PATTERNS"

if [ "$fail" -ne 0 ]; then
  echo ""
  echo "A claim above has no source. Either remove it, or add a dated row to"
  echo "EVIDENCE-LEDGER.md and delete its pattern from scripts/banned-claims.txt"
  echo "in the same commit."
  exit 1
fi

echo "check-claims: clean ($(grep -cvE '^(#|$)' "$PATTERNS") patterns, $(echo "$FILES" | wc -l | tr -d ' ') files)"
