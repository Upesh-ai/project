import axios from 'axios';
import * as cheerio from 'cheerio';

export async function fetchUrlContent(url) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Remove noise elements
    $('script, style, noscript, nav, footer, iframe, header, svg').remove();

    const title = $('title').text().trim() || $('h1').first().text().trim() || new URL(url).hostname;
    
    // Look for article or main content
    let bodyText = $('article').text();
    if (!bodyText || bodyText.length < 200) {
      bodyText = $('main').text();
    }
    if (!bodyText || bodyText.length < 200) {
      bodyText = $('body').text();
    }

    // Clean whitespace
    const cleanText = bodyText.replace(/\s+/g, ' ').trim().slice(0, 8000);

    // Detect dates from meta tags
    const pubDate = $('meta[property="article:published_time"]').attr('content')
      || $('meta[name="date"]').attr('content')
      || $('time').first().attr('datetime')
      || new Date().toISOString().split('T')[0];

    return {
      success: true,
      url,
      title,
      content: cleanText,
      date: pubDate.slice(0, 10),
      length: cleanText.length
    };
  } catch (error) {
    return {
      success: false,
      url,
      error: error.message || 'Failed to fetch content from URL',
      title: new URL(url).hostname,
      content: `Failed to scrape ${url}: ${error.message}. You can manually paste the text below.`,
      date: new Date().toISOString().split('T')[0]
    };
  }
}
