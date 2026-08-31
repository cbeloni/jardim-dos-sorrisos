#!/usr/bin/env bash

set -Eeuo pipefail

APP_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
VITE_BIN="$APP_DIR/node_modules/.bin/vite"
APP_PORT=5174

cd "$APP_DIR"

echo "[jardim] Encerrando versões anteriores..."

# O padrão aponta para o executável dentro deste projeto, sem atingir outros Vite.
OLD_PIDS="$(pgrep -f -- "$VITE_BIN" || true)"
if [[ -n "$OLD_PIDS" ]]; then
  while read -r pid; do
    [[ "$pid" == "$$" ]] && continue
    kill -TERM "$pid" 2>/dev/null || true
  done <<< "$OLD_PIDS"
  sleep 1

  REMAINING_PIDS="$(pgrep -f -- "$VITE_BIN" || true)"
  if [[ -n "$REMAINING_PIDS" ]]; then
    while read -r pid; do
      [[ "$pid" == "$$" ]] && continue
      kill -KILL "$pid" 2>/dev/null || true
    done <<< "$REMAINING_PIDS"
  fi
fi

echo "[jardim] Atualizando dependências..."
npm install --no-audit --no-fund

echo "[jardim] Iniciando servidor web..."
exec npm run dev -- --host 0.0.0.0 --port "$APP_PORT"
