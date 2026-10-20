#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

TARGET_IP="${1:?Usage: scripts/install-tv.sh TV_LAN_IP [SIGNING_PROFILE]}"
SIGNING_PROFILE="${2:-CleanM7}"
SDK_ROOT="${TIZEN_SDK_ROOT:-$PWD/.tools/tizen-studio}"
echo "=== Clean M7 TV Installer ==="
echo "1) Building web app..."
"$SDK_ROOT"/tools/ide/bin/tizen build-web -- app

echo "2) Packaging signed CleanM7.wgt..."
"$SDK_ROOT"/tools/ide/bin/tizen package -t wgt -s "$SIGNING_PROFILE" -- app/.buildResult
cp "app/.buildResult/Clean M7.wgt" app/.buildResult/CleanM7.wgt

echo "3) Connecting to Samsung Monitor ($TARGET_IP:26101)..."
"$SDK_ROOT"/tools/sdb connect "$TARGET_IP:26101"

echo "4) Installing CleanM7.wgt..."
"$SDK_ROOT"/tools/ide/bin/tizen install -n CleanM7.wgt -s "$TARGET_IP:26101" -- app/.buildResult

echo "5) Launching CleanM7App.Home..."
"$SDK_ROOT"/tools/ide/bin/tizen run -p CleanM7App.Home -s "$TARGET_IP:26101"
echo "=== Done! ==="
