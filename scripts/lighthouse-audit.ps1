# Lighthouse Audit Script for Karsaaz QR
# Requires: npm install -g lighthouse
# Requires: Google Chrome installed
# Usage: powershell -ExecutionPolicy Bypass -File scripts/lighthouse-audit.ps1

$ErrorActionPreference = "Stop"

Write-Host "=== Karsaaz QR - Lighthouse Audit ===" -ForegroundColor Cyan
Write-Host ""

# Check if lighthouse is installed
try {
    $null = Get-Command lighthouse -ErrorAction Stop
} catch {
    Write-Host "Lighthouse not found. Installing globally..." -ForegroundColor Yellow
    npm install -g lighthouse
}

$baseUrl = "http://localhost:3000"
$outputDir = "./lighthouse-reports"

if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

$pages = @(
    @{ name = "home";       path = "/" },
    @{ name = "login";      path = "/login" },
    @{ name = "signup";     path = "/signup" },
    @{ name = "pricing";    path = "/pricing" },
    @{ name = "checkout";   path = "/checkout" }
)

foreach ($page in $pages) {
    $url = "$baseUrl$($page.path)"
    $outFile = "$outputDir/lighthouse-$($page.name).html"

    Write-Host "Auditing: $url" -ForegroundColor Green
    lighthouse $url `
        --output=html `
        --output-path=$outFile `
        --chrome-flags="--headless --no-sandbox" `
        --only-categories=performance,accessibility,best-practices,seo `
        2>&1 | Out-Null

    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Report saved: $outFile" -ForegroundColor Gray
    } else {
        Write-Host "  Warning: audit for $($page.name) may have issues" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=== Audit Complete ===" -ForegroundColor Cyan
Write-Host "Reports are in $outputDir. Open the .html files in a browser to view."
