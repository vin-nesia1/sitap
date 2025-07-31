# 🚀 SITEMAP VIN NESIA

Tool profesional untuk mengekstrak semua link internal dari sebuah halaman website. Dapatkan sitemap lengkap dengan satu klik!!

## ✨ Fitur Utama

- 🔗 **Link Extraction**: Ekstrak semua link internal dari halaman website
- 📱 **Mobile Responsive**: Desain mobile-first yang optimal di semua device
- ⚡ **Fast Performance**: Built with Next.js 14 untuk performa maksimal
- 🎨 **Modern UI**: Desain gelap elegan dengan neon highlights
- 📥 **Download TXT**: Export hasil sitemap ke file .txt
- 📊 **Statistics**: Tampilkan total link dan waktu crawling
- 🔄 **Pagination**: Handle sitemap dengan ribuan link
- ⚠️ **Error Handling**: Penanganan error yang komprehensif
- 🌐 **SEO Optimized**: Meta tags, structured data, dan canonical URLs

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **HTML Parser**: Cheerio
- **Icons**: React Icons (Font Awesome)
- **Deployment**: Vercel

## 📋 Requirements

- Node.js 18+ 
- npm atau yarn
- Git

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/sitemap-vinnesia.git
cd sitemap-vinnesia
```

### 2. Install Dependencies

```bash
npm install
# atau
yarn install
```

### 3. Run Development Server

```bash
npm run dev
# atau
yarn dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## 📦 Deploy ke Vercel

### Cara 1: Deploy via GitHub (Recommended)

1. Push code ke GitHub repository
2. Buka [Vercel Dashboard](https://vercel.com/dashboard)
3. Klik "New Project"
4. Import repository dari GitHub
5. Set environment variables jika diperlukan
6. Klik "Deploy"

### Cara 2: Deploy via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Environment Variables (Optional)

```bash
NEXT_PUBLIC_SITE_URL=https://sitemap.vinnesia.my.id
NEXT_PUBLIC_SITE_NAME=SITEMAP VIN NESIA
```

## 📁 Struktur Project

```
sitemap-vinnesia/
├── app/
│   ├── api/
│   │   └── scrape/
│   │       └── route.ts          # API endpoint untuk scraping
│   ├── sitemap.xml/
│   │   └── route.ts              # Dynamic sitemap generator
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout dengan SEO
│   └── page.tsx                  # Main page component
├── public/
│   ├── favicon.ico               # Favicon
│   ├── logo.png                  # Logo
│   ├── robots.txt                # SEO robots file
│   └── manifest.json             # PWA manifest
├── package.json                  # Dependencies
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind configuration
└── README.md                     # Documentation
```

## 🎨 Customization

### Warna & Tema

Edit `tailwind.config.js` untuk mengubah tema warna:

```javascript
colors: {
  primary: {
    500: '#9333ea',    // Ungu utama
    600: '#7c3aed',
  },
  neon: {
    green: '#39ff14',  // Hijau neon
    yellow: '#ffff00', // Kuning emas
  }
}
```

### Logo & Branding

1. Ganti file di `public/logo.png` dengan logo Anda
2. Update favicon di `public/favicon.ico`
3. Edit nama brand di `app/page.tsx`

### Domain & SEO

Update domain di:
- `app/layout.tsx` (metadata)
- `next.config.js` (environment variables)
- `public/robots.txt`

## 🔧 API Documentation

### POST /api/scrape

Endpoint untuk scraping link dari website.

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Response Success:**
```json
{
  "success": true,
  "data": [
    {
      "url": "https://example.com/page1",
      "title": "Page Title"
    }
  ],
  "totalLinks": 25,
  "crawlTime": 1234,
  "baseUrl": "https://example.com"
}
```

**Response Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🛡️ Security Features

- ✅ Input validation & sanitization
- ✅ Rate limiting protection
- ✅ CORS configuration
- ✅ Security headers
- ✅ XSS protection
- ✅ URL validation

## 📈 Performance Optimizations

- ⚡ Next.js 14 App Router
- 🗜️ Image optimization
- 📦 Code splitting
- 🔄 Static generation
- 💾 Efficient caching
- 📱 Mobile-first design

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

- 📧 Email: admin@vinnesia.my.id
- 📧 Support: support@vinnesia.my.id
- 🌐 Website: https://vinnesia.my.id

## ⚠️ Disclaimer

VIN NESIA tidak bertanggung jawab atas penyalahgunaan tools ini. Gunakan dengan bijak dan hormati robots.txt dari website target.

---

© 2025 VIN NESIA. All rights reserved. Built with ❤️ for everyone.
