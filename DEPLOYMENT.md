# 🚀 Panduan Deploy SITEMAP VIN NESIA ke Vercel

Guide lengkap untuk deploy aplikasi Next.js sitemap generator ke Vercel dengan domain custom.

## 📋 Prerequisites

- ✅ Akun GitHub
- ✅ Akun Vercel (gratis)
- ✅ Domain custom (opsional): `sitemap.vinnesia.my.id`
- ✅ Git terinstall di komputer

## 🔧 Persiapan Repository

### 1. Fork atau Clone Repository

```bash
# Clone repository
git clone https://github.com/yourusername/sitemap-vinnesia.git
cd sitemap-vinnesia

# Atau fork repository di GitHub lalu clone
```

### 2. Install Dependencies (Testing Lokal)

```bash
npm install
npm run dev
```

Buka `http://localhost:3000` untuk testing.

### 3. Push ke GitHub

```bash
git add .
git commit -m "Initial commit: Sitemap VIN NESIA"
git push origin main
```

## 🌐 Deploy ke Vercel

### Metode 1: Via Dashboard Vercel (Recommended)

1. **Login ke Vercel**
   - Buka [vercel.com](https://vercel.com)
   - Login dengan akun GitHub

2. **Import Project**
   - Klik "New Project"
   - Pilih repository `sitemap-vinnesia`
   - Klik "Import"

3. **Configure Project**
   ```
   Project Name: sitemap-vinnesia
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Environment Variables (Optional)**
   ```
   NEXT_PUBLIC_SITE_URL = https://sitemap.vinnesia.my.id
   NEXT_PUBLIC_SITE_NAME = SITEMAP VIN NESIA
   ```

5. **Deploy**
   - Klik "Deploy"
   - Tunggu proses build selesai (2-5 menit)

### Metode 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Ikuti instruksi interactive
```

## 🔗 Setup Domain Custom

### 1. Konfigurasi Domain di Vercel

1. Masuk ke project dashboard
2. Klik tab "Settings" → "Domains"
3. Add domain: `sitemap.vinnesia.my.id`
4. Vercel akan memberikan DNS records

### 2. Update DNS Records

Tambahkan record berikut di DNS provider Anda:

```
Type: CNAME
Name: sitemap
Value: cname.vercel-dns.com
TTL: 3600
```

Atau jika menggunakan root domain:

```
Type: A
Name: @
Value: 76.76.19.61
TTL: 3600

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### 3. Verifikasi Domain

- Tunggu propagasi DNS (5-60 menit)
- Vercel akan otomatis generate SSL certificate
- Test akses: `https://sitemap.vinnesia.my.id`

## 🔧 Environment Variables Production

Tambahkan di Vercel Dashboard → Settings → Environment Variables:

```bash
# Required
NEXT_PUBLIC_SITE_URL=https://sitemap.vinnesia.my.id
NEXT_PUBLIC_SITE_NAME=SITEMAP VIN NESIA

# SEO (Optional)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX

# API Configuration
API_RATE_LIMIT=100
API_TIMEOUT=30000
```

## 🚀 Deployment Checklist

### Pre-Deploy

- [ ] Repository sudah di GitHub
- [ ] Dependencies sudah terinstall
- [ ] Build berhasil lokal (`npm run build`)
- [ ] Environment variables sudah disiapkan
- [ ] Domain sudah disiapkan (jika ada)

### Deploy Process

- [ ] Project berhasil di-import ke Vercel
- [ ] Build sukses (check build logs)
- [ ] Environment variables sudah diset
- [ ] Domain custom sudah dikonfigurasi
- [ ] SSL certificate aktif

### Post-Deploy

- [ ] Website dapat diakses via HTTPS
- [ ] Semua fitur berfungsi normal
- [ ] API endpoint `/api/scrape` berjalan
- [ ] SEO meta tags tampil benar
- [ ] Performance testing (GTmetrix, PageSpeed)

## 🔄 Auto-Deploy Setup

Vercel otomatis deploy setiap kali ada push ke branch `main`:

```bash
# Update code
git add .
git commit -m "Update feature"
git push origin main

# Vercel akan otomatis build & deploy
```

### Branch Protection (Optional)

Setup di GitHub → Settings → Branches:
- Require pull request reviews
- Require status checks (Vercel build)
- Restrict pushes to main branch

## 📊 Monitoring & Analytics

### 1. Vercel Analytics

Enable di dashboard:
```
Project → Analytics → Enable
```

### 2. Google Analytics (Optional)

Tambahkan di `app/layout.tsx`:

```typescript
// Google Analytics
{process.env.NEXT_PUBLIC_GA_TRACKING_ID && (
  <Script
    src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}
    strategy="afterInteractive"
  />
)}
```

### 3. Error Monitoring

- Vercel Functions logs
- Real User Monitoring (RUM)
- Core Web Vitals tracking

## 🛠️ Troubleshooting

### Build Errors

```bash
# Common issues:
- Missing dependencies → npm install
- TypeScript errors → npm run type-check
- ESLint errors → npm run lint
```

### Domain Issues

```bash
# DNS not propagating
- Check DNS with: dig sitemap.vinnesia.my.id
- Clear DNS cache: ipconfig /flushdns (Windows)
- Wait 24-48 hours for full propagation
```

### API Errors

```bash
# Function timeout
- Check function duration in Vercel dashboard
- Optimize scraping logic
- Add better error handling
```

### Performance Issues

```bash
# Slow loading
- Optimize images (Next.js Image component)
- Enable compression
- Use CDN for static assets
- Check Core Web Vitals
```

## 🔐 Security Configuration

### 1. Headers

Sudah dikonfigurasi di `next.config.js`:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

### 2. CORS

API sudah dikonfigurasi untuk menerima request dari domain sendiri.

### 3. Rate Limiting

Implement di API route jika diperlukan:

```typescript
// utils/rateLimit.ts
import { NextRequest } from 'next/server';

const rateLimitMap = new Map();

export function rateLimit(request: NextRequest) {
  const ip = request.ip || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  const record = rateLimitMap.get(ip);
  
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}
```

## 📈 Performance Optimization

### 1. Next.js Optimizations

- Static Generation untuk halaman yang tidak berubah
- Image optimization dengan Next.js Image
- Code splitting otomatis
- Bundle analyzer untuk monitoring size

### 2. Vercel Optimizations

- Edge Functions untuk API yang cepat
- CDN untuk static assets
- Automatic compression (Gzip/Brotli)
- Smart caching headers

### 3. Database (Jika Diperlukan)

Untuk fitur advanced bisa tambahkan:
- Vercel KV (Redis) untuk caching
- Vercel Postgres untuk data persistence
- Upstash Redis untuk rate limiting

## 🎯 Success Metrics

Target performance setelah deploy:

- ✅ **Performance Score**: >90 (PageSpeed Insights)
- ✅ **First Contentful Paint**: <1.5s
- ✅ **Time to Interactive**: <3s
- ✅ **Cumulative Layout Shift**: <0.1
- ✅ **API Response Time**: <2s untuk crawling
- ✅ **Uptime**: >99.9%

## 🔄 Maintenance

### Regular Updates

```bash
# Update dependencies monthly
npm update
npm audit fix

# Update Next.js
npm install next@latest

# Security updates
npm audit --audit-level high
```

### Backup Strategy

- Code: GitHub repository
- Analytics data: Export regularly
- Domain: Keep DNS records documented

---

## 📞 Support

Jika ada masalah deployment:

- 📧 Email: admin@vinnesia.my.id
- 📚 Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- 🐛 Issues: GitHub repository issues

**Happy Deploying! 🚀**
