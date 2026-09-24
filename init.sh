#!/bin/bash
set -eu -o pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <target-dir>"
  exit 1
fi

repo_url=https://github.com/logica0419/coding-oidc.git
tmp_dir=$(mktemp -d)

trap 'rm -rf "$tmp_dir"' EXIT INT TERM HUP

git clone --depth 1 --filter=blob:none --sparse "$repo_url" "$tmp_dir/repo"
git -C "$tmp_dir/repo" sparse-checkout set templates
mkdir -p "$1"
cp -a "$tmp_dir/repo/templates/." "$1"
