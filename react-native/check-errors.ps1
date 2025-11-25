# FinTrackr Pre-Build Error Checker
Write-Host "`nFinTrackr Pre-Build Error Checker`n" -ForegroundColor Cyan

$errorCount = 0

# 1. TypeScript Check
Write-Host "1. Checking TypeScript types..." -ForegroundColor Yellow
npx tsc --noEmit 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   PASS: No TypeScript errors" -ForegroundColor Green
} else {
    Write-Host "   FAIL: TypeScript errors found" -ForegroundColor Red
    $errorCount++
}

# 2. Check duplicate category IDs
Write-Host "`n2. Checking for duplicate category IDs..." -ForegroundColor Yellow
$json = Get-Content src/config/categories.json | ConvertFrom-Json
$ids = $json | ForEach-Object { $_.id }
$duplicates = $ids | Group-Object | Where-Object { $_.Count -gt 1 }
if ($duplicates) {
    Write-Host "   FAIL: Duplicate category IDs found" -ForegroundColor Red
    $errorCount++
} else {
    Write-Host "   PASS: No duplicate category IDs" -ForegroundColor Green
}

# 3. Check duplicate transaction IDs
Write-Host "`n3. Checking for duplicate transaction IDs..." -ForegroundColor Yellow
$json = Get-Content src/config/transactions.json | ConvertFrom-Json
$ids = $json | ForEach-Object { $_.id }
$duplicates = $ids | Group-Object | Where-Object { $_.Count -gt 1 }
if ($duplicates) {
    Write-Host "   FAIL: Duplicate transaction IDs found" -ForegroundColor Red
    $errorCount++
} else {
    Write-Host "   PASS: No duplicate transaction IDs" -ForegroundColor Green
}

# 4. Check environment variables
Write-Host "`n4. Checking environment variables..." -ForegroundColor Yellow
if (Test-Path .env) {
    Write-Host "   PASS: .env file exists" -ForegroundColor Green
} else {
    Write-Host "   FAIL: .env file not found" -ForegroundColor Red
    $errorCount++
}

# 5. Check assets
Write-Host "`n5. Checking for required assets..." -ForegroundColor Yellow
$requiredAssets = @('1.webp', '2.webp', '3.webp', '4.webp', 'auth-logo.webp')
$missing = @()
foreach ($asset in $requiredAssets) {
    if (-not (Test-Path "assets/$asset")) {
        $missing += $asset
    }
}
if ($missing.Count -gt 0) {
    Write-Host "   FAIL: Missing assets: $($missing -join ', ')" -ForegroundColor Red
    $errorCount++
} else {
    Write-Host "   PASS: All required assets present" -ForegroundColor Green
}

# 6. Check node_modules
Write-Host "`n6. Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "   PASS: Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "   FAIL: node_modules not found" -ForegroundColor Red
    $errorCount++
}

# Final Summary
Write-Host "`n============================================" -ForegroundColor Cyan
if ($errorCount -eq 0) {
    Write-Host "SUCCESS: All checks passed!" -ForegroundColor Green
    Write-Host "`nReady to build:" -ForegroundColor Cyan
    Write-Host "  eas build --platform android --profile production"
} else {
    Write-Host "ERROR: Found $errorCount issue(s)" -ForegroundColor Red
    Write-Host "Fix the errors above before building" -ForegroundColor Yellow
}
Write-Host "============================================`n" -ForegroundColor Cyan
