#!/bin/sh
# Start MARZIPAN OS dev server
REAL_NODE="/Applications/Codex.app/Contents/Resources/cua_node/bin/node"
mkdir -p /tmp/real-node-bin
ln -sf "$REAL_NODE" /tmp/real-node-bin/node
PATH="/tmp/real-node-bin:$PATH" "$REAL_NODE" "$(dirname "$0")/node_modules/next/dist/bin/next" dev --port 3030
