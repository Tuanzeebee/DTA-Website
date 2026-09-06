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