# DTA deployment on Windows VPS

This setup does not use Docker and does not touch IIS/HTTP.sys on ports 80/443.
Nginx listens only on `127.0.0.1:8080`, NestJS listens only on
`127.0.0.1:3000`, and Cloudflare Tunnel connects to Nginx.

Run PowerShell as Administrator for the installation and service commands.

## 1. Install prerequisites

Install Node.js 22+, Git, Nginx for Windows, PostgreSQL, and cloudflared.
Use the existing application directory:

```powershell
Set-Location C:\DTAWeb\DTA-Website-main
```

Install dependencies and build both apps:

```powershell
Set-Location C:\DTAWeb\DTA-Website-main\dta-new-backend
npm ci
npx prisma generate
npm run build
New-Item -ItemType Directory -Force C:\DTAWeb\DTA-Website-main\dta-new-backend\uploads | Out-Null

Set-Location C:\DTAWeb\DTA-Website-main\dta-news
npm ci
npm run build
```

## 2. Configure backend environment

Copy `deploy\.env.example` to `C:\DTAWeb\DTA-Website-main\dta-new-backend\.env` and replace the
database password and JWT secret. Use Windows paths:

```dotenv
DATABASE_URL=postgresql://dta:YOUR_PASSWORD@localhost:5432/dta?schema=public
JWT_ACCESS_SECRET=USE_A_LONG_RANDOM_SECRET
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_TTL_DAYS=7
EXPORT_DIR=C:/DTAWeb/DTA-Website-main/dta-new-backend/craw-data/export
HOST=127.0.0.1
PORT=3000
```

Create the PostgreSQL database using `psql` as a PostgreSQL administrator:

```powershell
psql -U postgres -c "CREATE USER dta WITH PASSWORD 'YOUR_PASSWORD';"
psql -U postgres -c "CREATE DATABASE dta OWNER dta;"
Set-Location C:\DTAWeb\DTA-Website-main\dta-new-backend
$env:DATABASE_URL = 'postgresql://dta:YOUR_PASSWORD@localhost:5432/dta?schema=public'
npx prisma migrate deploy
```

## 3. Run NestJS as a Windows service

Install NSSM, then create a service that starts the compiled NestJS app:

```powershell
nssm install DTA-Backend C:\Program Files\nodejs\node.exe
nssm set DTA-Backend AppDirectory C:\DTAWeb\DTA-Website-main\dta-new-backend
nssm set DTA-Backend AppParameters C:\DTAWeb\DTA-Website-main\dta-new-backend\dist\main.js
nssm set DTA-Backend AppEnvironmentExtra NODE_ENV=production
nssm set DTA-Backend AppExit Default Exit
nssm set DTA-Backend Start SERVICE_AUTO_START
nssm start DTA-Backend
```

Verify the backend locally:

```powershell
Get-NetTCPConnection -LocalPort 3000 -State Listen
Invoke-WebRequest http://127.0.0.1:3000/news/topics
```

## 4. Configure Nginx

Copy `nginx.conf` to the Nginx `conf` directory, then verify and reload it:

```powershell
New-Item -ItemType Directory -Force C:\nginx\conf\conf.d | Out-Null
Copy-Item C:\DTAWeb\DTA-Website-main\dta-news\nginx.conf C:\nginx\conf\conf.d\dta.conf -Force
Set-Location C:\nginx
.\nginx.exe -t
.\nginx.exe -s reload
```

If Nginx is not already a Windows service, install it with NSSM:

```powershell
nssm install DTA-Nginx C:\nginx\nginx.exe
nssm set DTA-Nginx AppDirectory C:\nginx
nssm set DTA-Nginx Start SERVICE_AUTO_START
nssm start DTA-Nginx
```

Verify the private frontend endpoint:

```powershell
Get-NetTCPConnection -LocalPort 8080 -State Listen
Invoke-WebRequest http://127.0.0.1:8080
```

## 5. Configure Cloudflare Tunnel

Create the tunnel and DNS records:

```powershell
cloudflared tunnel login
cloudflared tunnel create dta-web
cloudflared tunnel route dns dta-web dta.com.vn
cloudflared tunnel route dns dta-web www.dta.com.vn
```

Copy `cloudflared-config.yml.example` to
`C:\ProgramData\cloudflared\config.yml`, replace the tunnel ID and credential
filename, then install the Cloudflared Windows service:

```powershell
cloudflared service install
Start-Service cloudflared
Get-Service cloudflared
```

The tunnel ingress must point to:

```yaml
service: http://127.0.0.1:8080
```

No Windows firewall rule for public port 80/443 is needed for DTA. Keep
PostgreSQL port 5432 private and do not expose NestJS port 3000 publicly.

## 6. IIS direct deployment (after the read-only audit)

The repository includes `public\web.config`. Vite copies it to `dist\web.config`
during `npm run build`. It provides SPA fallback and proxies `/api`,
`/uploads`, and `/news-images` to `127.0.0.1:3000` through IIS URL Rewrite and
ARR. Install and enable URL Rewrite/ARR before creating this site. Do not use
this section until the audit confirms that `dta.com.vn` and
`www.dta.com.vn` are not bound to another site.

Run the read-only audit first:

```powershell
Set-Location C:\DTAWeb\DTA-Website-main\dta-news
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\deploy\iis-audit.ps1
```

Review the generated report and keep the `applicationHost.config.backup` file.
The script does not create sites, bindings, firewall rules, certificates,
services, or DNS records. It redacts the Cloudflare tunnel ID and credential
path in its report. Never send private keys, tunnel tokens, or application
secrets with the audit output.

After the audit is reviewed and no hostname conflict exists, create a
dedicated IIS site. Replace the path and certificate thumbprint placeholders;
do not reuse another site's application pool or certificate binding:

```powershell
Import-Module WebAdministration
$siteName = 'DTA-Website'
$physicalPath = 'C:\DTAWeb\DTA-Website-main\dta-news\dist'
$appPool = 'DTA-Website'
$thumbprint = '<CERTIFICATE_THUMBPRINT>'

New-WebAppPool -Name $appPool
Set-ItemProperty "IIS:\AppPools\$appPool" -Name managedRuntimeVersion -Value ''
New-Website -Name $siteName -PhysicalPath $physicalPath -ApplicationPool $appPool `
	-Port 80 -HostHeader 'dta.com.vn'
New-WebBinding -Name $siteName -Protocol http -Port 80 -HostHeader 'www.dta.com.vn'

New-WebBinding -Name $siteName -Protocol https -Port 443 -HostHeader 'dta.com.vn' -SslFlags 1
New-WebBinding -Name $siteName -Protocol https -Port 443 -HostHeader 'www.dta.com.vn' -SslFlags 1
Get-Item "Cert:\LocalMachine\My\$thumbprint" | New-Item "IIS:\SslBindings\0.0.0.0!443!dta.com.vn"
Get-Item "Cert:\LocalMachine\My\$thumbprint" | New-Item "IIS:\SslBindings\0.0.0.0!443!www.dta.com.vn"
```

The binding commands above are intentionally not run by the repository
scripts. Before running them, verify that the certificate contains both names
and that the exact HTTPS bindings do not already exist. If either hostname is
already used, stop and resolve the conflict first.

Add only missing public firewall rules, without opening application or
database ports:

```powershell
New-NetFirewallRule -DisplayName 'DTA HTTP' -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow
New-NetFirewallRule -DisplayName 'DTA HTTPS' -Direction Inbound -Protocol TCP -LocalPort 443 -Action Allow
```

Before DNS changes, test the site from a client using a temporary hosts-file
entry for the VPS public IP. Then change only these Tenten records:

```text
@      A       <PUBLIC_IP_VPS>
www    A       <PUBLIC_IP_VPS>
```

Keep the Cloudflare Tunnel running until HTTPS, SPA routes, `/api`, uploads,
images, database access, and every existing IIS website have been tested.
Do not stop or remove a tunnel that serves another hostname.