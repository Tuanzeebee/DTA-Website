# DTA production deployment

For a Windows VPS, follow [windows-README.md](windows-README.md). The steps
below are for Linux only.

This deployment does not use Docker. Nginx serves the React SPA on the private
loopback port `8080`, systemd runs NestJS, PostgreSQL runs locally, and
Cloudflare Tunnel exposes only Nginx. Existing IIS/HTTP.sys websites on ports
80/443 are left untouched.
Nginx proxies `/api`, `/uploads`, and `/news-images` to NestJS.

## VPS setup

1. Install Node.js 22+, PostgreSQL, Nginx, and `cloudflared` on the VPS.
2. Create a dedicated service user and application directories:

   ```bash
   sudo useradd --system --create-home --shell /usr/sbin/nologin dta
   sudo mkdir -p /opt /var/www/dta-news /etc/dta
   sudo chown -R dta:dta /var/www/dta-news
   ```

3. Clone both repositories as sibling directories named `dta-news` and
   `dta-new-backend` under `/opt`, then install dependencies:

   ```bash
   cd /opt/dta-new-backend
   npm ci
   npx prisma generate
   npm run build
   sudo mkdir -p /opt/dta-new-backend/uploads
   sudo chown -R dta:dta /opt/dta-new-backend

   cd /opt/dta-news
   npm ci
   npm run build
   sudo cp nginx.conf /etc/nginx/sites-available/dta.conf
   sudo ln -sfn /etc/nginx/sites-available/dta.conf /etc/nginx/sites-enabled/dta.conf
   sudo rsync -a --delete dist/ /var/www/dta-news/dist/
   ```

4. Create the PostgreSQL database and user, then copy `deploy/.env.example` to
   `/etc/dta/backend.env`. Replace all placeholder secrets before continuing.
   Make the env file readable only by the service user and apply migrations:

   ```bash
   sudo -u postgres createuser --pwprompt dta
   sudo -u postgres createdb -O dta dta
   sudo cp /opt/dta-news/deploy/.env.example /etc/dta/backend.env
   sudo chown dta:dta /etc/dta/backend.env
   sudo chmod 600 /etc/dta/backend.env
   sudo chown -R dta:dta /opt/dta-new-backend/uploads
   sudo -u dta bash -lc 'set -a; . /etc/dta/backend.env; set +a; cd /opt/dta-new-backend && npx prisma migrate deploy'
   ```

5. Install and start the NestJS systemd service:

   ```bash
   sudo cp /opt/dta-news/deploy/dta-backend.service.example /etc/systemd/system/dta-backend.service
   sudo systemctl daemon-reload
   sudo systemctl enable --now dta-backend
   sudo ss -ltnp | grep ':8080' || true
   sudo nginx -t && sudo systemctl reload nginx
   ```

6. Create a tunnel and route both hostnames to the tunnel:

   ```bash
   cloudflared tunnel login
   cloudflared tunnel create dta-web
   cloudflared tunnel route dns dta-web dta.com.vn
   cloudflared tunnel route dns dta-web www.dta.com.vn
   ```

7. Copy `cloudflared-config.yml.example` to `/etc/cloudflared/config.yml`,
   replace the tunnel ID and credential filename, then install the service:

   ```bash
   sudo cloudflared service install
   sudo systemctl enable --now cloudflared
   ```

8. Check the services:

   ```bash
   sudo systemctl status dta-backend nginx cloudflared
   curl -I http://127.0.0.1:8080
   sudo journalctl -u cloudflared -n 50 --no-pager
   ```

The Cloudflare DNS records are managed by the tunnel commands. The tunnel
connects directly to `127.0.0.1:8080`; no public port 80/443 is needed for DTA.
Keep SSH restricted to trusted IPs and do not publish PostgreSQL port 5432.
The application currently has no Redis dependency or Redis configuration.