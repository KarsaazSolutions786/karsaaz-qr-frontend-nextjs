$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")
if (-not (Test-Path .env)) {
  Copy-Item .env.team.example .env
  Write-Host "Created .env from .env.team.example — set NEXT_PUBLIC_API_URL to host LAN IP"
}
docker compose -f docker-compose.dev.yml up @args
