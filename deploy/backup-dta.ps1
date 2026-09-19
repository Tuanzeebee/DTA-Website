<#
.SYNOPSIS
  Backup database + uploads + env của DTA Website (Windows).
.DESCRIPTION
  Chạy trên máy đang chạy hệ thống (máy cũ). Tạo 3 file trong thư mục backup:
    - dta-YYYYMMDD-HHmm.dump  (PostgreSQL custom format)
    - uploads-YYYYMMDD-HHmm.zip (toàn bộ ảnh backend)
    - backend.env.bak (bản sao .env backend — GIỮ KÍN, không commit)
  Giữ lại bản backup trong số ngày -KeepDays (mặc định 14 ngày).
.EXAMPLE
  powershell -ExecutionPolicy Bypass -File backup-dta.ps1
  powershell -ExecutionPolicy Bypass -File backup-dta.ps1 -BackupDir D:\Backup -KeepDays 30
#>
param(
  [string]$BackupDir = "C:\DTA-Backup",
  [string]$AppRoot = "C:\DTAWeb\DTA-Website-main",
  [string]$PgUser = "dta",
  [string]$DbName = "dta",
  [int]$KeepDays = 14
)

$ErrorActionPreference = "Stop"

# Tự tìm pg_dump của bản PostgreSQL mới nhất
$pgBin = Get-ChildItem "C:\Program Files\PostgreSQL" -Directory -ErrorAction SilentlyContinue |
  Sort-Object Name -Descending |
  ForEach-Object { Join-Path $_.FullName "bin\pg_dump.exe" } |
  Where-Object { Test-Path $_ } |
  Select-Object -First 1
if (-not $pgBin) { throw "Không tìm thấy pg_dump.exe trong C:\Program Files\PostgreSQL" }

$stamp = Get-Date -Format "yyyyMMdd-HHmm"
New-Item -ItemType Directory -Force $BackupDir | Out-Null

$dumpFile = Join-Path $BackupDir "dta-$stamp.dump"
$uploadsZip = Join-Path $BackupDir "uploads-$stamp.zip"
$envBak = Join-Path $BackupDir "backend.env.bak"

Write-Host "== [1/3] Dump database '$DbName'..."
# Mật khẩu lấy từ biến môi trường PGPASSWORD (đặt trước khi chạy), hoặc pg_dump sẽ hỏi
& $pgBin -U $PgUser -h localhost -F c -f $dumpFile $DbName
Write-Host "OK: $dumpFile"

Write-Host "== [2/3] Nén thư mục uploads..."
$uploadsDir = Join-Path $AppRoot "dta-new-backend\uploads"
if (-not (Test-Path $uploadsDir)) { throw "Không thấy thư mục $uploadsDir" }
if (Test-Path $uploadsZip) { Remove-Item $uploadsZip -Force }
Compress-Archive -Path (Join-Path $uploadsDir "*") -DestinationPath $uploadsZip
Write-Host "OK: $uploadsZip"

Write-Host "== [3/3] Sao lưu file .env backend..."
$envFile = Join-Path $AppRoot "dta-new-backend\.env"
if (Test-Path $envFile) {
  Copy-Item $envFile $envBak -Force
  Write-Host "OK: $envBak  (BẢO MẬT — không gửi lung tung, không commit git)"
} else {
  Write-Warning "Không thấy $envFile — bỏ qua bước này."
}

Write-Host "== Dọn bản backup quá $KeepDays ngày..."
Get-ChildItem $BackupDir -File |
  Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-$KeepDays) } |
  ForEach-Object { Remove-Item $_.FullName -Force; Write-Host "Xóa: $($_.Name)" }

Write-Host ""
Write-Host "HOÀN TẤT. Chép cả thư mục $BackupDir sang máy mới/VPS."
