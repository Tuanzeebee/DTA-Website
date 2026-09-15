[CmdletBinding()]
param(
  [string]$OutputDirectory = "C:\DTAWeb\audit\iis-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Continue'

New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null
$transcriptPath = Join-Path $OutputDirectory 'audit.log'
Start-Transcript -Path $transcriptPath -Force | Out-Null

function Save-Section {
  param(
    [Parameter(Mandatory)] [string]$Name,
    [Parameter(Mandatory)] [scriptblock]$Command
  )

  $path = Join-Path $OutputDirectory "$Name.txt"
  "### $Name" | Set-Content -Path $path -Encoding UTF8
  try {
    & $Command 2>&1 | Out-String -Width 240 | Add-Content -Path $path -Encoding UTF8
  } catch {
    "ERROR: $($_.Exception.Message)" | Add-Content -Path $path -Encoding UTF8
  }
}

Save-Section '01-sites' {
  Import-Module WebAdministration -ErrorAction Stop
  Get-Website | Select-Object Name, State, PhysicalPath, ApplicationPool | Format-List
}

Save-Section '02-bindings' {
  Import-Module WebAdministration -ErrorAction Stop
  Get-Website | ForEach-Object {
    "SITE: $($_.Name)"
    Get-WebBinding -Name $_.Name | Select-Object Protocol, BindingInformation, sslFlags | Format-Table -AutoSize
  }
}

Save-Section '03-application-pools' {
  Import-Module WebAdministration -ErrorAction Stop
  Get-ChildItem IIS:\AppPools |
    Select-Object Name, State, managedRuntimeVersion, managedPipelineMode | Format-Table -AutoSize
}

Save-Section '04-ssl-bindings' {
  Import-Module WebAdministration -ErrorAction Stop
  Get-ChildItem IIS:\SslBindings | Select-Object PSPath, Sites, IPAddress, Port, Host, Thumbprint | Format-List
}

Save-Section '05-certificates' {
  Get-ChildItem Cert:\LocalMachine\My |
    Select-Object Subject, DNSNameList, Thumbprint, NotBefore, NotAfter, HasPrivateKey, EnhancedKeyUsageList |
    Sort-Object NotAfter | Format-List
}

Save-Section '06-listeners' {
  $ports = 80, 443, 3000, 5173, 5432, 8080
  Get-NetTCPConnection -State Listen |
    Where-Object { $_.LocalPort -in $ports } |
    Select-Object LocalAddress, LocalPort, OwningProcess, State |
    Sort-Object LocalPort, LocalAddress | Format-Table -AutoSize

  Get-NetTCPConnection -State Listen |
    Where-Object { $_.LocalPort -in $ports } |
    Select-Object -ExpandProperty OwningProcess -Unique |
    ForEach-Object { Get-Process -Id $_ -ErrorAction SilentlyContinue } |
    Select-Object Id, ProcessName, Path | Format-Table -AutoSize
}

Save-Section '07-rewrite-arr' {
  Import-Module WebAdministration -ErrorAction Stop
  "Global modules:"
  Get-WebGlobalModule | Select-Object Name, Image | Format-Table -AutoSize
  "Global proxy configuration:"
  Get-WebConfiguration system.webServer/proxy | Format-List
  "Global rewrite rules:"
  Get-WebConfiguration system.webServer/rewrite/rules/* |
    Select-Object name, enabled, pattern | Format-Table -AutoSize
}

Save-Section '08-firewall' {
  Get-NetFirewallProfile | Select-Object Name, Enabled, DefaultInboundAction | Format-Table -AutoSize
  "Inbound rules for relevant ports:"
  Get-NetFirewallRule -Enabled True -Direction Inbound -Action Allow |
    Get-NetFirewallPortFilter |
    Where-Object { $_.LocalPort -in '80', '443', '3000', '5173', '5432' } |
    Select-Object Name, Protocol, LocalPort, RemoteAddress | Format-Table -AutoSize
}

Save-Section '09-dns' {
  foreach ($name in 'dta.com.vn', 'www.dta.com.vn', 'api.dta.com.vn') {
    "### $name A/AAAA/CNAME"
    Resolve-DnsName $name -Type A, AAAA, CNAME -ErrorAction SilentlyContinue |
      Select-Object Name, Type, IPAddress, NameHost, TTL | Format-Table -AutoSize
  }
}

Save-Section '10-public-ip' {
  try { "api.ipify.org: $(Invoke-RestMethod https://api.ipify.org -TimeoutSec 10)" } catch { $_.Exception.Message }
  try { "ifconfig.me: $(Invoke-RestMethod https://ifconfig.me -TimeoutSec 10)" } catch { $_.Exception.Message }
}

Save-Section '11-cloudflared-service' {
  Get-Service cloudflared -ErrorAction SilentlyContinue |
    Select-Object Name, Status, StartType | Format-List
  $configPath = 'C:\ProgramData\cloudflared\config.yml'
  if (Test-Path $configPath) {
    "Config exists: $configPath"
    Get-Content $configPath |
      ForEach-Object {
        $_ -replace '(?i)(credentials-file\s*:\s*).+', '$1<redacted>' `
           -replace '(?i)(tunnel\s*:\s*).+', '$1<redacted>'
      }
  } else {
    'Config not found at C:\ProgramData\cloudflared\config.yml'
  }
  if (Get-Command cloudflared -ErrorAction SilentlyContinue) {
    cloudflared tunnel list 2>&1
  } else {
    'cloudflared executable not found in PATH'
  }
}

Save-Section '12-system' {
  Get-ComputerInfo | Select-Object WindowsProductName, WindowsVersion, OsBuildNumber | Format-List
  Get-Command w3wp, nginx, cloudflared -ErrorAction SilentlyContinue |
    Select-Object Name, Source, Version | Format-Table -AutoSize
}

$applicationHost = Join-Path $env:windir 'System32\inetsrv\config\applicationHost.config'
if (Test-Path $applicationHost) {
  Copy-Item $applicationHost (Join-Path $OutputDirectory 'applicationHost.config.backup') -Force
}

@"
Audit completed: $(Get-Date -Format o)
Output directory: $OutputDirectory
No IIS, firewall, DNS, certificate, application pool, service, or tunnel configuration was changed by this script.
"@ | Set-Content (Join-Path $OutputDirectory 'README.txt') -Encoding UTF8

Stop-Transcript | Out-Null
Write-Output "Audit saved to $OutputDirectory"
