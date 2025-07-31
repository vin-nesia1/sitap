import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface SitemapResult {
  url: string;
  title?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL tidak boleh kosong' },
        { status: 400 }
      );
    }

    // Validasi URL
    let targetUrl: URL;
    try {
      targetUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Format URL tidak valid' },
        { status: 400 }
      );
    }

    const startTime = Date.now();
    
    // Fetch halaman dengan axios
    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
      },
    });

    const $ = cheerio.load(response.data);
    const links: SitemapResult[] = [];
    const baseUrl = `${targetUrl.protocol}//${targetUrl.host}`;
    const seenUrls = new Set<string>();

    // Ekstrak semua link dengan tag 'a'
    $('a[href]').each((_, element) => {
      let href = $(element).attr('href');
      if (!href) return;

      // Normalisasi URL
      let fullUrl: string;
      try {
        if (href.startsWith('http://') || href.startsWith('https://')) {
          fullUrl = href;
        } else if (href.startsWith('//')) {
          fullUrl = `${targetUrl.protocol}${href}`;
        } else if (href.startsWith('/')) {
          fullUrl = `${baseUrl}${href}`;
        } else if (href.startsWith('#')) {
          return; // Skip anchor links
        } else {
          // Relative URL
          const currentPath = targetUrl.pathname.endsWith('/') 
            ? targetUrl.pathname 
            : targetUrl.pathname.substring(0, targetUrl.pathname.lastIndexOf('/') + 1);
          fullUrl = `${baseUrl}${currentPath}${href}`;
        }

        // Validasi URL yang sudah dinormalisasi
        const normalizedUrl = new URL(fullUrl);
        
        // Hanya ambil link internal (domain yang sama)
        if (normalizedUrl.host === targetUrl.host) {
          // Clean URL (remove fragment)
          const cleanUrl = `${normalizedUrl.protocol}//${normalizedUrl.host}${normalizedUrl.pathname}${normalizedUrl.search}`;
          
          if (!seenUrls.has(cleanUrl)) {
            seenUrls.add(cleanUrl);
            
            // Ambil title dari link jika ada
            const title = $(element).attr('title') || $(element).text().trim() || undefined;
            
            links.push({
              url: cleanUrl,
              title: title && title.length > 0 && title.length < 200 ? title : undefined
            });
          }
        }
      } catch (e) {
        // Skip invalid URLs
        console.warn(`Invalid URL: ${href}`);
      }
    });

    // Ekstrak meta links (canonical, alternate, etc.)
    $('link[href]').each((_, element) => {
      const href = $(element).attr('href');
      const rel = $(element).attr('rel');
      
      if (!href || !rel) return;
      
      try {
        let fullUrl: string;
        if (href.startsWith('http://') || href.startsWith('https://')) {
          fullUrl = href;
        } else if (href.startsWith('//')) {
          fullUrl = `${targetUrl.protocol}${href}`;
        } else if (href.startsWith('/')) {
          fullUrl = `${baseUrl}${href}`;
        } else {
          return;
        }

        const normalizedUrl = new URL(fullUrl);
        
        if (normalizedUrl.host === targetUrl.host) {
          const cleanUrl = `${normalizedUrl.protocol}//${normalizedUrl.host}${normalizedUrl.pathname}${normalizedUrl.search}`;
          
          if (!seenUrls.has(cleanUrl)) {
            seenUrls.add(cleanUrl);
            
            links.push({
              url: cleanUrl,
              title: `Meta Link (${rel})`
            });
          }
        }
      } catch (e) {
        console.warn(`Invalid meta link: ${href}`);
      }
    });

    // Sort links alphabetically
    links.sort((a, b) => a.url.localeCompare(b.url));

    const endTime = Date.now();
    const crawlTime = endTime - startTime;

    return NextResponse.json({
      success: true,
      data: links,
      totalLinks: links.length,
      crawlTime,
      baseUrl
    });

  } catch (error: any) {
    console.error('Scraping error:', error);
    
    let errorMessage = 'Terjadi kesalahan saat crawling';
    
    if (error.code === 'ENOTFOUND') {
      errorMessage = 'Domain tidak ditemukan';
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Koneksi ditolak oleh server';
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = 'Request timeout';
    } else if (error.response?.status === 404) {
      errorMessage = 'Halaman tidak ditemukan (404)';
    } else if (error.response?.status === 403) {
      errorMessage = 'Akses ditolak (403)';
    } else if (error.response?.status >= 500) {
      errorMessage = 'Server error';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
