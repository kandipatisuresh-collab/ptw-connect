#!/usr/bin/env bash
set -Eeuo pipefail

# Run from the repository root so the script works from any current directory.
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
  trap - EXIT INT TERM

  if [[ -n "$FRONTEND_PID" ]] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi

  if [[ -n "$BACKEND_PID" ]] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
}

fail() {
  echo "Error: $1" >&2
  exit 1
}

trap cleanup EXIT INT TERM

cd "$ROOT_DIR"

if [[ -f ".env" ]]; then
  set -a
  # The local .env file must contain shell-compatible KEY=value entries.
  source .env
  set +a
fi

BACKEND_PORT="${BACKEND_PORT:-3000}"
FRONTEND_PORT="${FRONTEND_PORT:-4173}"
BACKEND_URL="http://127.0.0.1:${BACKEND_PORT}"
FRONTEND_URL="http://127.0.0.1:${FRONTEND_PORT}"

command -v node >/dev/null 2>&1 || fail "Node.js is required. Install Node.js 18 or newer."

if command -v npm >/dev/null 2>&1; then
  NPM_COMMAND="npm"
elif command -v npm.cmd >/dev/null 2>&1; then
  NPM_COMMAND="npm.cmd"
else
  fail "npm is required. Install Node.js with npm included."
fi

if ! [[ "$BACKEND_PORT" =~ ^[0-9]+$ ]] || ! [[ "$FRONTEND_PORT" =~ ^[0-9]+$ ]]; then
  fail "BACKEND_PORT and FRONTEND_PORT must be numeric."
fi

echo "Building the PTW application..."
"$NPM_COMMAND" run build

if [[ "${CREATE_DATABASE:-false}" == "true" ]]; then
  [[ -n "${DATABASE_ADMIN_URL:-}" ]] || fail "DATABASE_ADMIN_URL is required when CREATE_DATABASE=true."
  [[ -n "${DATABASE_URL:-}" ]] || fail "DATABASE_URL is required when CREATE_DATABASE=true."
  echo "Creating the local PTW database if needed..."
  "$NPM_COMMAND" run db:create
fi

if [[ "${RUN_DB_MIGRATIONS:-false}" == "true" ]]; then
  [[ -n "${DATABASE_URL:-}" ]] || fail "DATABASE_URL is required when RUN_DB_MIGRATIONS=true."
  echo "Applying database migrations..."
  "$NPM_COMMAND" run db:migrate
fi

[[ -f "backend/dist/main.js" ]] || fail "Backend build output was not created."
[[ -f "frontend/dist/index.html" ]] || fail "Frontend build output was not created."

echo "Starting backend at ${BACKEND_URL}..."
NODE_ENV="${NODE_ENV:-development}" PTW_DEMO_ADMIN_ENABLED="${PTW_DEMO_ADMIN_ENABLED:-true}" PORT="$BACKEND_PORT" node backend/dist/main.js &
BACKEND_PID=$!

echo "Starting frontend at ${FRONTEND_URL}..."
BACKEND_PORT="$BACKEND_PORT" FRONTEND_PORT="$FRONTEND_PORT" node scripts/serve-frontend.mjs &
FRONTEND_PID=$!

wait_for_url() {
  local url="$1"
  local service="$2"
  local attempt
  local status

  for attempt in {1..30}; do
    if command -v curl >/dev/null 2>&1; then
      status="$(curl --silent --output /dev/null --write-out '%{http_code}' --max-time 2 "$url" 2>/dev/null || true)"
      if [[ "$status" =~ ^[1-4][0-9][0-9]$ ]]; then
        return 0
      fi
    fi

    if ! kill -0 "$BACKEND_PID" 2>/dev/null && [[ "$service" == "backend" ]]; then
      fail "Backend stopped before becoming ready."
    fi

    if ! kill -0 "$FRONTEND_PID" 2>/dev/null && [[ "$service" == "frontend" ]]; then
      fail "Frontend stopped before becoming ready."
    fi

    sleep 1
  done

  fail "${service^} did not become ready at ${url}."
}

wait_for_url "$BACKEND_URL" "backend"
wait_for_url "$FRONTEND_URL" "frontend"

open_browser() {
  if command -v powershell.exe >/dev/null 2>&1; then
    PTW_FRONTEND_URL="$FRONTEND_URL" powershell.exe -NoProfile -Command '$url = $env:PTW_FRONTEND_URL; $paths = @("$env:ProgramFiles\Google\Chrome\Application\chrome.exe", "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe", "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"); $chrome = $paths | Where-Object { Test-Path $_ } | Select-Object -First 1; if (-not $chrome) { exit 1 }; Start-Process -FilePath $chrome -ArgumentList $url' >/dev/null 2>&1 && return
  elif command -v google-chrome >/dev/null 2>&1; then
    google-chrome "$FRONTEND_URL" >/dev/null 2>&1 &
    return
  elif command -v google-chrome-stable >/dev/null 2>&1; then
    google-chrome-stable "$FRONTEND_URL" >/dev/null 2>&1 &
    return
  elif command -v chromium >/dev/null 2>&1; then
    chromium "$FRONTEND_URL" >/dev/null 2>&1 &
    return
  elif command -v chromium-browser >/dev/null 2>&1; then
    chromium-browser "$FRONTEND_URL" >/dev/null 2>&1 &
    return
  fi

  if command -v cmd.exe >/dev/null 2>&1; then
    cmd.exe /c start "" "$FRONTEND_URL" >/dev/null 2>&1 || true
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$FRONTEND_URL" >/dev/null 2>&1 &
  elif command -v open >/dev/null 2>&1; then
    open "$FRONTEND_URL" >/dev/null 2>&1 &
  else
    echo "Open ${FRONTEND_URL} in a web browser."
  fi
}

open_browser
echo ""
echo "PTW is running."
echo "Frontend: ${FRONTEND_URL}"
echo "Backend:  ${BACKEND_URL}"
echo "Press Ctrl+C to stop both services."

wait "$BACKEND_PID" "$FRONTEND_PID"