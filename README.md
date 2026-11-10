# DTA Website — Frontend

Giao diện website **dta.com.vn** (trang tin + trang quản trị). Backend API nằm ở repo `dta-new-backend`.

## Công nghệ

| Thành phần | Phiên bản |
|---|---|
| React | 19.2 |
| TypeScript | 5.9 |
| Vite | 8.1 |
| TanStack Router / React Query | 1.170 / 5 |
| Tailwind CSS | 4.3 |
| UI | Radix UI (shadcn/ui), lucide-react, motion |
| Form | react-hook-form + zod |

Đây là **SPA tĩnh, không có SSR**: build ra HTML/JS/CSS, không cần Node.js khi chạy production.
Không cần biến môi trường: mọi API gọi theo đường dẫn tương đối `/api/...`.

## Chạy khi phát triển

Cần Node.js ≥ 20 và backend chạy ở `http://localhost:3000`.

```bash
npm ci
npm run dev        # Vite tự proxy /api, /uploads, /news-images sang localhost:3000
```

## Build production

```bash
npm ci
npm run build      # kết quả trong dist/
```

Chép thư mục `dist/` lên web server. Cấu hình Nginx mẫu: [nginx.conf](nginx.conf). Web server cần:

- trả file tĩnh trong `dist/`, các URL không phải file thì trả `index.html` (SPA fallback)
- chuyển tiếp `/api/` → `http://127.0.0.1:3000/` (bỏ tiền tố `/api`)
- chuyển tiếp `/uploads/` và `/news-images/` → `http://127.0.0.1:3000` (giữ nguyên đường dẫn)
- cho phép upload tối đa 25 MB (`client_max_body_size 25m`)
- `/assets/*` có hash trong tên file nên cache lâu được; `index.html` để `no-cache`

## Deploy toàn bộ hệ thống

- Linux: [deploy/README.md](deploy/README.md)
- Windows Server: [deploy/windows-README.md](deploy/windows-README.md)
- Khôi phục dữ liệu khi chuyển server: xem README của `dta-new-backend`

Thư mục `deploy/` còn có mẫu systemd (`dta-backend.service.example`), mẫu Cloudflare Tunnel
(`cloudflared-config.yml.example`) và script backup/restore cho Windows (`backup-dta.ps1`, `restore-dta.ps1`).
