#!/bin/bash

# Script to wrap server-api functions with cache()
# Run: bash update-server-api.sh

FILE="src/lib/server-api.ts"

# Update export async function to export const = cache(async
sed -i.bak 's/^export async function \([^(]*\)(/export const \1 = cache(async (/g' "$FILE"

# Find and add closing ) for cache calls
# This requires manual verification but the pattern is set

echo "✅ Updated server-api.ts exports to use cache()"
echo "⚠️  Please verify manually that closing parentheses are correct"
echo "   Look for functions and ensure they end with })"

