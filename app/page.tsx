'use client';

import { useState, useRef } from 'react';

// --- Fungsi-fungsi pembantu untuk aplikasi ini ---
const isValidUrl = (urlString: string): boolean => {
  try {
    const urlObj = new URL(urlString);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

const formatTime = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
};

const generateSitemapFilename = (url: string): string => {
  try {
    const domain = new URL(url).hostname.replace(/^www\./, '');
    const timestamp = new Date().toISOString().split('T')[0];
    return `sitemap-${domain}-${timestamp}.txt`;
  } catch {
    return `sitemap-${new Date().toISOString().split('T')[0]}.txt`;
  }
};

const downloadTextFile = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const copyToClipboard = (text: string): boolean => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  const success = document.execCommand('copy');
  document.body.removeChild(textarea);
  return success;
};

// --- Komponen Utama Aplikasi ---
export default function App() {
  const [url, setUrl] = useState('');
  const [sitemapData, setSitemapData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const sitemapRef = useRef<HTMLDivElement>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (error) setError('');
  };

  const handleGenerateSitemap = async () => {
    setError('');
    setSitemapData(null);
    setCopySuccess(false);

    if (!url || !isValidUrl(url)) {
      setError('URL tidak valid. Mohon masukkan URL yang benar.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Terjadi kesalahan saat mengambil sitemap.');
      }

      setSitemapData(result);
    } catch (e: any) {
      setError(e.message || 'Terjadi kesalahan tidak terduga.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (sitemapData?.data) {
      const sitemapContent = sitemapData.data.map((link: any) => link.url).join('\n');
      const filename = generateSitemapFilename(url);
      downloadTextFile(sitemapContent, filename);
    }
  };

  const handleCopy = () => {
    if (sitemapData?.data) {
      const sitemapContent = sitemapData.data.map((link: any) => link.url).join('\n');
      const success = copyToClipboard(sitemapContent);
      setCopySuccess(success);
      if (success) {
        setTimeout(() => setCopySuccess(false), 2000);
      }
    }
  };
  
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen font-sans">
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        {/* Header dan Aplikasi Utama */}
        <div className="bg-gray-800 p-6 md:p-10 rounded-2xl shadow-xl border border-gray-700">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-8">
            <img
              src="https://placehold.co/100x100/34D399/FFFFFF?text=VIN"
              alt="Logo Vin Nesia"
              width={100}
              height={100}
              className="rounded-full border-4 border-green-400 p-1"
            />
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-green-400 mb-2 leading-tight">
                SITEMAP VIN NESIA
              </h1>
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
                Tool profesional untuk mengekstrak semua link internal dari sebuah halaman website. Dapatkan sitemap lengkap dengan satu klik!
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <label className="block text-lg font-semibold text-yellow-300" htmlFor="url-input">
              Masukkan URL Website
            </label>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative flex-grow">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔗</span>
                <input
                  type="text"
                  id="url-input"
                  className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                  placeholder="https://example.com"
                  value={url}
                  onChange={handleUrlChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleGenerateSitemap();
                  }}
                />
              </div>
              <button
                onClick={handleGenerateSitemap}
                disabled={loading}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="animate-spin">🔄</span>
                ) : (
                  <span>🧭</span>
                )}
                <span>Generate Sitemap</span>
              </button>
            </div>
            {error && (
              <div className="bg-red-900 text-red-300 p-4 rounded-xl flex items-center space-x-3">
                <span className="text-red-500">⚠️</span>
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Bagian Hasil */}
          {sitemapData && (
            <div className="mt-8 bg-gray-700 p-6 rounded-2xl shadow-inner border border-gray-600">
              <h2 className="text-2xl font-bold text-yellow-300 flex items-center space-x-2 mb-4">
                <span className="text-green-400">✅</span>
                <span>Sitemap Berhasil Dibuat!</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">🌐</span>
                  <span>URL Dasar: <a href={sitemapData.baseUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-green-300">{sitemapData.baseUrl}</a></span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">🔗</span>
                  <span>Total Tautan Ditemukan: {sitemapData.totalLinks}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">⏰</span>
                  <span>Waktu Crawl: {formatTime(sitemapData.crawlTime)}</span>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                <button
                  onClick={handleDownload}
                  className="flex-1 min-w-[150px] flex items-center justify-center space-x-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300"
                >
                  <span>📥</span>
                  <span>Unduh Sitemap (.txt)</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="flex-1 min-w-[150px] flex items-center justify-center space-x-2 bg-gray-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-gray-700 transition-all duration-300"
                >
                  <span>📋</span>
                  <span>Salin ke Clipboard</span>
                </button>
                {copySuccess && (
                  <div className="flex-1 min-w-[150px] flex items-center justify-center text-green-400 font-bold">
                    Tersalin!
                  </div>
                )}
              </div>
              <div ref={sitemapRef} className="mt-8 max-h-96 overflow-y-auto bg-gray-800 p-4 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold text-yellow-300 mb-2">Daftar Tautan:</h3>
                <ul className="space-y-1 text-sm text-gray-300">
                  {sitemapData.data.map((link: any, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1 flex-shrink-0">🔗</span>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate hover:text-green-300 transition-colors underline"
                      >
                        {link.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-gray-400">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-700 pt-8">
            <div>
              <h3 className="flex items-center space-x-2 text-lg font-semibold mb-4 text-green-300">
                <span>📖</span>
                <span>Halaman</span>
              </h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-green-300 transition-colors underline">Home</a></li>
                <li><a href="#" className="hover:text-green-300 transition-colors underline">Semua Tools</a></li>
                <li><a href="#" className="hover:text-green-300 transition-colors underline">Blog</a></li>
                <li><a href="#" className="hover:text-green-300 transition-colors underline">Tentang Kami</a></li>
              </ul>
            </div>
            <div>
              <h3 className="flex items-center space-x-2 text-lg font-semibold mb-4 text-yellow-300">
                <span>⚖️</span>
                <span>Legal</span>
              </h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-green-300 transition-colors underline">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-green-300 transition-colors underline">Terms of Service</a></li>
                <li><a href="#" className="hover:text-green-300 transition-colors underline">Sitemap</a></li>
              </ul>
              
              <h3 className="flex items-center space-x-2 text-lg font-semibold mb-4 mt-6 text-green-300">
                <span>✉️</span>
                <span>Email Kami</span>
              </h3>
              <ul className="space-y-2">
                <li><a href="mailto:admin@vinnesia.my.id" className="hover:text-green-300 transition-colors underline">admin@vinnesia.my.id</a></li>
                <li><a href="mailto:support@vinnesia.my.id" className="hover:text-green-300 transition-colors underline">support@vinnesia.my.id</a></li>
                <li><a href="mailto:privacy@vinnesia.my.id" className="hover:text-green-300 transition-colors underline">privacy@vinnesia.my.id</a></li>
              </ul>
            </div>
            <div>
              <h3 className="flex items-center space-x-2 text-lg font-semibold mb-4 text-yellow-300">
                <span>📱</span>
                <span>Media Sosial</span>
              </h3>
              <div className="flex space-x-3">
                <a href="#" className="text-yellow-400 hover:text-yellow-300 transition-colors text-xl">
                  📷
                </a>
                <a href="#" className="text-yellow-400 hover:text-yellow-300 transition-colors text-xl">
                  📞
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 mt-8 text-center">
            <p className="text-gray-400 mb-2">
              © 2025 VIN NESIA. All rights reserved. Built with ❤️ for everyone.
            </p>
            <p className="text-yellow-400 text-sm">
              ⚠️ VIN NESIA tidak bertanggung jawab atas penyalahgunaan tools ini.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
