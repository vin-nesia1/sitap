import { NextRequest, NextResponse } from 'next/server';

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

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `Gagal mengambil URL: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const htmlContent = await response.text();
    const links: SitemapResult[] = [];
    const seenUrls = new Set<string>();
    
    // Gunakan DOMParser bawaan untuk parsing HTML
    const parser = new (self as any).DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    const baseUrl = targetUrl.origin;

    // Ambil semua tag <a>
    doc.querySelectorAll('a').forEach((linkElement: HTMLAnchorElement) => {
      const href = linkElement.getAttribute('href');
      if (href) {
        try {
          const absoluteUrl = new URL(href, baseUrl);
          let cleanUrl = absoluteUrl.href;
          
          // Hapus hash dan parameter query
          cleanUrl = cleanUrl.split('#')[0].split('?')[0];

          // Pastikan URL berada di domain yang sama dan belum dilihat
          if (cleanUrl.startsWith(baseUrl) && !seenUrls.has(cleanUrl)) {
            seenUrls.add(cleanUrl);
            links.push({
              url: cleanUrl,
              title: linkElement.textContent?.trim() || 'Link'
            });
          }
        } catch (e) {
          console.warn(`Invalid URL: ${href}`);
        }
      }
    });

    // Ambil semua tag <link rel="canonical"> dan <link rel="alternate">
    doc.querySelectorAll('link[rel="canonical"], link[rel="alternate"]').forEach((linkElement: HTMLLinkElement) => {
      const href = linkElement.getAttribute('href');
      if (href) {
        try {
          const absoluteUrl = new URL(href, baseUrl);
          let cleanUrl = absoluteUrl.href;
          cleanUrl = cleanUrl.split('#')[0].split('?')[0];

          if (cleanUrl.startsWith(baseUrl) && !seenUrls.has(cleanUrl)) {
            seenUrls.add(cleanUrl);
            const rel = linkElement.getAttribute('rel');
            links.push({
              url: cleanUrl,
              title: `Meta Link (${rel})`
            });
          }
        } catch (e) {
          console.warn(`Invalid meta link: ${href}`);
        }
      }
    });

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
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
