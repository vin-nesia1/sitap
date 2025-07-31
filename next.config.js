'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaCompass, FaBook, FaBalanceScale, FaEnvelope, FaMobile, FaDownload, FaSpinner, FaLink, FaClock, FaInstagram, FaWhatsapp, FaExternalLinkAlt, FaCheckCircle, FaExclamationTriangle, FaCopy, FaGlobe } from 'react-icons/fa';

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

const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    
    document.body.appendChild(textarea);
    textarea.select();
    
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    
    return success;
  }
};

// --- Interfaces untuk data yang akan diterima ---
interface SitemapResult {
  url: string;
  title?: string;
}

interface ScrapeResponse {
  success: boolean;
  data?: SitemapResult[];
  error?: string;
  totalLinks?: number;
  crawlTime?: number;
  baseUrl?: string;
}

// --- Komponen utama aplikasi ---
export default function SitemapGenerator() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SitemapResult[]>([]);
  const [totalLinks, setTotalLinks] = useState(0);
  const [crawlTime, setCrawlTime] = useState(0);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsPerPage = 50;

  // Fokus pada input saat komponen dimuat
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('URL tidak boleh kosong');
      return;
    }

    if (!isValidUrl(url)) {
      setError('Format URL tidak valid. Gunakan format: https://example.com');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);
    setTotalLinks(0);
    setCrawlTime(0);
    setCurrentPage(1);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data: ScrapeResponse = await response.json();

      if (data.success && data.data) {
        setResults(data.data);
        setTotalLinks(data.totalLinks || data.data.length);
        setCrawlTime(data.crawlTime || 0);
      } else {
        setError(data.error || 'Terjadi kesalahan saat crawling');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan koneksi');
    } finally {
      setLoading(false);
    }
  };

  const downloadTxt = () => {
    const content = results.map(item => item.url).join('\n');
    const filename = generateSitemapFilename(url);
    downloadTextFile(content, filename);
  };

  const copyAllLinks = async () => {
    const content = results.map(item => item.url).join('\n');
    const success = await copyToClipboard(content);
    if (success) {
      // Anda bisa menambahkan notifikasi di sini
      console.log('Tautan berhasil disalin ke clipboard!');
    }
  };

  const paginatedResults = results.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const totalPages = Math.ceil(results.length / resultsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-green-400 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">🔗</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-green-400 to-yellow-400 bg-clip-text text-transparent">
              SITEMAP VIN NESIA
            </h1>
          </div>
        </div>
        
        <p className="text-center text-gray-300 mb-8 max-w-2xl mx-auto">
          Tool profesional untuk mengekstrak semua link internal dari sebuah halaman website. 
          Dapatkan sitemap lengkap dengan satu klik!
        </p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-16">
        {/* Input Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-purple-500/20 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-lg font-semibold mb-3 text-purple-300">
                Masukkan URL Website
              </label>
              <input
                ref={inputRef}
                type="text"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-6 py-4 bg-gray-700/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 rounded-xl font-semibold text-white transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Crawling...</span>
                </>
              ) : (
                <>
                  <span>🔗</span>
                  <span>Generate Sitemap</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-green-500/20 shadow-2xl">
            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center space-x-2 bg-purple-500/20 px-4 py-2 rounded-lg">
                <span className="text-purple-400">🔗</span>
                <span className="text-purple-300">Total Link: {totalLinks}</span>
              </div>
              <div className="flex items-center space-x-2 bg-green-500/20 px-4 py-2 rounded-lg">
                <span className="text-green-400">⏱️</span>
                <span className="text-green-300">Waktu Crawl: {formatTime(crawlTime)}</span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={downloadTxt}
                  className="flex items-center space-x-2 bg-yellow-500/20 hover:bg-yellow-500/30 px-4 py-2 rounded-lg transition-all text-yellow-300 hover:text-yellow-200"
                >
                  <span>💾</span>
                  <span>Download TXT</span>
                </button>
                <button
                  onClick={copyAllLinks}
                  className="flex items-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 px-4 py-2 rounded-lg transition-all text-blue-300 hover:text-blue-200"
                >
                  <span>📋</span>
                  <span>Copy All</span>
                </button>
              </div>
            </div>

            {/* Links List */}
            <div className="space-y-3 mb-6">
              {paginatedResults.map((item, index) => {
                const displayIndex = (currentPage - 1) * resultsPerPage + index + 1;
                return (
                  <div
                    key={index}
                    className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/30 hover:border-purple-500/50 transition-all hover:bg-gray-700/50 group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs text-gray-500 font-mono">#{displayIndex}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-400 text-xs">✅</span>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-purple-300 transition-colors"
                        >
                          <span className="text-xs">🔗</span>
                        </a>
                      </div>
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 font-mono text-sm break-all transition-colors block group-hover:text-green-300"
                    >
                      {item.url}
                    </a>
                    {item.title && (
                      <p className="text-gray-400 text-xs mt-2 truncate" title={item.title}>
                        📄 {item.title}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-gray-700 rounded-lg">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900/80 backdrop-blur-sm border-t border-purple-500/20 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Navigasi */}
            <div>
              <h3 className="flex items-center space-x-2 text-lg font-semibold mb-4 text-purple-300">
                <span className="text-purple-400">🧭</span>
                <span>Navigasi</span>
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-300 transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-purple-300 transition-colors">Semua Tools</a></li>
                <li><a href="#" className="hover:text-purple-300 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-purple-300 transition-colors">Tentang Kami</a></li>
              </ul>
            </div>

            {/* Bantuan */}
            <div>
              <h3 className="flex items-center space-x-2 text-lg font-semibold mb-4 text-purple-300">
                <span className="text-purple-400">📚</span>
                <span>Bantuan</span>
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-300 transition-colors">Cara Pakai Tools</a></li>
                <li><a href="#" className="hover:text-purple-300 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-purple-300 transition-colors">Kontak Kami</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="flex items-center space-x-2 text-lg font-semibold mb-4 text-purple-300">
                <span className="text-purple-400">⚖️</span>
                <span>Legal</span>
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-300 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-purple-300 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-purple-300 transition-colors">Sitemap</a></li>
              </ul>
            </div>

            {/* Kontak */}
            <div>
              <h3 className="flex items-center space-x-2 text-lg font-semibold mb-4 text-purple-300">
                <span className="text-purple-400">✉️</span>
                <span>Email</span>
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="mailto:admin@vinnesia.my.id" className="hover:text-green-300 transition-colors underline">admin@vinnesia.my.id</a></li>
                <li><a href="mailto:support@vinnesia.my.id" className="hover:text-green-300 transition-colors underline">support@vinnesia.my.id</a></li>
                <li><a href="mailto:privacy@vinnesia.my.id" className="hover:text-green-300 transition-colors underline">privacy@vinnesia.my.id</a></li>
              </ul>

              <h3 className="flex items-center space-x-2 text-lg font-semibold mb-4 mt-6 text-yellow-300">
                <span className="text-yellow-400">📱</span>
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

          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 mb-2">
              © 2025 VIN NESIA. All rights reserved. Built with ❤️ for everyone.
            </p>
            <p className="text-yellow-400 text-sm">
              ⚠️ VIN NESIA tidak bertanggung jawab atas penyalahgunaan tools.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
