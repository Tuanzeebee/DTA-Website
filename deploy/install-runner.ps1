# Install a GitHub Actions self-hosted runner as a Windows service on the DTA VPS.
# Run ONCE PER REPO in an Administrator PowerShell (2 repos = run twice):
#
#   .\install-runner.ps1 -Repo Tuanzeebee/DTA-Website-Backend -Token <TOKEN>
#   .\install-runner.ps1 -Repo Tuanzeebee/DTA-Website         -Token <TOKEN>
#
# <TOKEN>: GitHub repo > Settings > Actions > Runners > New self-hosted runner
# (Windows) - copy the value after --token. It expires after 1 hour.
#
# The runner only makes OUTBOUND HTTPS calls to GitHub: no SSH, no open ports.
# -Account/-Password: Windows account the service runs as. It needs write access
# to C:\DTAWeb and rights to stop/start the DTA-Backend service. Omit to use
# NT AUTHORITY\NETWORK SERVICE (then grant those rights separately).
param(
  [Parameter(Mandatory)][string]$Repo,
  [Parameter(Mandatory)][string]$Token,
  [string]$Account,
  [string]$Password,
  [string]$Root = 'C:\actions-runner'
)
$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$name = 'dta-' + ($Repo.Split('/')[1]).ToLower()
$dir = Join-Path $Root $name
if (Test-Path "$dir\.runner") { throw "Runner already configured in $dir" }
New-Item -ItemType Directory -Force $dir | Out-Null
New-Item -ItemType Directory -Force 'C:\DTAWeb\releases' | Out-Null

$rel = Invoke-RestMethod https://api.github.com/repos/actions/runner/releases/latest
$asset = $rel.assets | Where-Object { $_.name -like 'actions-runner-win-x64-*.zip' } | Select-Object -First 1
Write-Host "Downloading runner $($rel.tag_name) ..."
$zip = Join-Path $env:TEMP $asset.name
Invoke-WebRequest $asset.browser_download_url -OutFile $zip -UseBasicParsing
Expand-Archive $zip -DestinationPath $dir -Force
Remove-Item $zip

$cfg = @('--unattended', '--url', "https://github.com/$Repo", '--token', $Token,
         '--name', $name, '--labels', 'dta', '--work', '_work', '--runasservice')
if ($Account) { $cfg += @('--windowslogonaccount', $Account, '--windowslogonpassword', $Password) }
Push-Location $dir
try {
  & .\config.cmd @cfg
  if ($LASTEXITCODE) { throw "config.cmd failed ($LASTEXITCODE)" }
} finally { Pop-Location }

Write-Host "Runner '$name' installed. Check: GitHub repo > Settings > Actions > Runners = Idle."
