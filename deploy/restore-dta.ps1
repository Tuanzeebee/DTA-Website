<#
.SYNOPSIS
  Restore database + uploads + env của DTA Website lên máy mới/VPS (Windows).
.DESCRIPTION
  Chạy trên máy MỚI sau khi đã: cài Node 22+, PostgreSQL, chép code về $AppRoot,
  npm ci + build backend/frontend theo windows-README.md.
  Script làm 4 việc: tạo DB, restore dump, bung uploads, nhắc migrate + restart service.
  KHÔNG chạy seed sau restore (tránh trùng dữ liệu).
.EXAMPLE
  powershell -ExecutionPolicy Bypass -File restore-dta.ps1 -BackupFile C:\DTA-Backup\dta-20260919-2100.dump -UploadsZip C:\DTA-Backup\uploads-20260919-2100.zip
#>
param(
  [Parameter(Mandatory = $true)][string]$BackupFile,
  [Parameter(Mandatory = $true)][string]$UploadsZip,
  [string]$EnvBak = "",
  [string]$AppRoot = "C:\DTAWeb\DTA-Website-main",
  [string]$PgUser = "dta",
  [string]$DbName = "dta",
  [string]$ServiceName = "DTA-Backend"
)

$ErrorActionPreference = "Stop"

$pgRoot = Get-ChildItem "C:\Program Files\PostgreSQL" -Directory -ErrorAction SilentlyContinue |
  Sort-Object Name -Descending | Select-Object -First 1
if (-not $pgRoot) { throw "Không tìm thấy PostgreSQL trong C:\Program Files\PostgreSQL" }
$psql = Join-Path $pgRoot.FullName "bin\psql.exe"
$restore = Join-Path $pgRoot.FullName "bin\pg_restore.exe"

if (-not (Test-Path $BackupFile)) { throw "Không thấy file backup $BackupFile" }
if (-not (Test-Path $UploadsZip)) { throw "Không thấy file $UploadsZip" }

Write-Host "== [1/4] Tạo database '$DbName' (bỏ qua nếu đã có)..."
& $psql -U postgres -h localhost -c "CREATE USER $PgUser WITH PASSWORD 'doi-mat-khau-nay';" 2>$null
& $psql -U postgres -h localhost -c "CREATE DATABASE $DbName OWNER $PgUser;" 2>$null
Write-Host "OK"

Write-Host "== [2/4] Restore dữ liệu..."
& $restore -U $PgUser -h localhost -d $DbName --no-owner --role=$PgUser $BackupFile
Write-Host "OK"

Write-Host "== [3/4] Bung thư mục uploads..."
$uploadsDir = Join-Path $AppRoot "dta-new-backend\uploads"
New-Item -ItemType Directory -Force $uploadsDir | Out-Null
Expand-Archive -Path $UploadsZip -DestinationPath $uploadsDir -Force
Write-Host "OK: $uploadsDir"

if ($EnvBak -ne "" -and (Test-Path $EnvBak)) {
  $envFile = Join-Path $AppRoot "dta-new-backend\.env"
  Copy-Item $EnvBak $envFile -Force
  Write-Host "OK: đã chép .env -> $envFile (kiểm tra lại DATABASE_URL cho đúng máy mới)"
} else {
  Write-Warning "Chưa chép .env — tự tạo dta-new-backend\.env theo deploy\.env.example"
}

Write-Host "== [4/4] Đồng bộ schema + restart service..."
Push-Location (Join-Path $AppRoot "dta-new-backend")
try {
  npx prisma migrate deploy
} finally {
  Pop-Location
}
Write-Host "Nếu báo 'No pending migrations' là schema đã khớp dữ liệu restore."

$nssm = Get-Command nssm -ErrorAction SilentlyContinue
if ($nssm -and (Get-Service $ServiceName -ErrorAction SilentlyContinue)) {
  Restart-Service $ServiceName
  Write-Host "OK: đã restart service $ServiceName"
} else {
  Write-Warning "Service $ServiceName chưa có — cài theo windows-README.md rồi start tay."
}

Write-Host ""
Write-Host "KIỂM TRA: mở trang chủ + /thu-vien-anh, đăng nhập admin xem đủ dữ liệu."
Write-Host "TUYỆT ĐỐI không chạy seed:rbac/seed:members/import:wordpress sau restore."
