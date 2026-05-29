/**
 * Anikage Scraper core functions
 */

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export interface SearchResult {
  slug: string;
  anilistId: number;
  title: {
    romaji: string;
    english?: string;
    native?: string;
  };
  coverImage: {
    medium?: string;
    large?: string;
    extraLarge?: string;
  };
  type: string;
  format: string;
  status: string;
  totalEpisodes: number;
  currentEpisode: number;
  averageScore?: number;
  genres: string[];
  year?: number;
}

/**
 * Parses SvelteKit devalue serialized JSON layout format
 */
export function parseSvelteKitData(rawData: any): any {
  if (!rawData || !rawData.nodes) return null;
  
  let merged: any = {};
  
  for (const node of rawData.nodes) {
    if (node && node.type === 'data' && Array.isArray(node.data)) {
      const arr = node.data;
      const cache = new Map<number, any>();
      
      function resolve(idx: any): any {
        if (idx === null || idx === undefined) return null;
        if (typeof idx !== 'number') return idx;
        if (cache.has(idx)) return cache.get(idx);
        
        const val = arr[idx];
        if (val === null || val === undefined) {
          return val;
        }
        
        if (Array.isArray(val)) {
          const res: any[] = [];
          cache.set(idx, res);
          for (const item of val) {
            res.push(resolve(item));
          }
          return res;
        } else if (typeof val === 'object') {
          const res: any = {};
          cache.set(idx, res);
          for (const key of Object.keys(val)) {
            res[key] = resolve(val[key]);
          }
          return res;
        } else {
          cache.set(idx, val);
          return val;
        }
      }
      
      const nodeParsed = resolve(0);
      if (nodeParsed && typeof nodeParsed === 'object' && !Array.isArray(nodeParsed)) {
        merged = { ...merged, ...nodeParsed };
      }
    }
  }
  return merged;
}

/**
 * 1. Search Anime
 */
export async function searchAnime(query: string, page: number = 1, perPage: number = 25): Promise<{ results: SearchResult[]; total: number }> {
  const params = new URLSearchParams({
    query: query,
    sort: 'popularity',
    page: String(page),
    per_page: String(perPage),
    include_adult: 'true'
  });
  
  const url = `https://anikage.cc/api/media/anime/advanced-search?${params.toString()}`;
  const res = await fetch(url, {
    headers: {
      'user-agent': USER_AGENT,
      'referer': 'https://anikage.cc/browse'
    }
  });
  
  if (!res.ok) {
    throw new Error(`Failed to search anime: HTTP ${res.status}`);
  }
  
  return await res.json() as any;
}

/**
 * 2. Get Anime Metadata and Details (utilizes SvelteKit layout json)
 */
export async function getAnimeInfo(slug: string): Promise<any> {
  const url = `https://anikage.cc/anime/info/${slug}/__data.json`;
  const res = await fetch(url, {
    headers: {
      'user-agent': USER_AGENT,
      'referer': 'https://anikage.cc/'
    }
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch anime info: HTTP ${res.status}`);
  }
  
  const rawData = await res.json();
  const parsed = parseSvelteKitData(rawData);
  if (!parsed || !parsed.animeInfo) {
    throw new Error("Failed to parse SvelteKit anime layout data");
  }
  
  return parsed.animeInfo;
}

/**
 * 3. Fetch Anime Episodes List
 */
export async function getEpisodes(slug: string): Promise<any[]> {
  const url = `https://anikage.cc/api/media/anime/${slug}/episodes`;
  const res = await fetch(url, {
    headers: {
      'user-agent': USER_AGENT,
      'referer': 'https://anikage.cc/'
    }
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch episodes: HTTP ${res.status}`);
  }
  
  const json = await res.json() as any;
  return Array.isArray(json) ? json : json.episodes || [];
}

/**
 * 4. Fetch Anime Servers list for an episode
 */
export async function getServers(slug: string, episode: number): Promise<any[]> {
  const url = `https://anikage.cc/api/media/anime/${slug}/episodes/${episode}/servers`;
  const res = await fetch(url, {
    headers: {
      'user-agent': USER_AGENT,
      'referer': 'https://anikage.cc/'
    }
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch servers: HTTP ${res.status}`);
  }
  
  return await res.json() as any[];
}

/**
 * 5. Fetch Stream sources (decodes to prox.anikage.cc M3U8 links)
 */
export async function getStreams(slug: string, episode: number, provider: string = 'pahe', lang: string = 'sub'): Promise<any> {
  const url = `https://anikage.cc/api/media/anime/${slug}/episodes/${episode}/sources?provider=${provider}&lang=${lang}`;
  const res = await fetch(url, {
    headers: {
      'user-agent': USER_AGENT,
      'referer': 'https://anikage.cc/'
    }
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch streams: HTTP ${res.status}`);
  }
  
  const data: any = await res.json();
  if (data && Array.isArray(data.sources)) {
    data.sources = data.sources.map((src: any) => {
      // If the url is encrypted (does not start with http/https), build the proxied m3u8 url
      let playUrl = src.url;
      if (playUrl && !playUrl.startsWith('http://') && !playUrl.startsWith('https://')) {
        playUrl = `https://prox.anikage.cc/stream/${src.url}/index.txt`;
      }
      return {
        ...src,
        streamUrl: playUrl
      };
    });
  }
  
  return data;
}

/**
 * 6. Scrape Megaplay Player directly (returns iframe & decoded direct m3u8)
 */
export async function getMegaplayStream(anilistId: number, episode: number, lang: string = 'sub'): Promise<any> {
  const playerIframeUrl = `https://megaplay.buzz/stream/ani/${anilistId}/${episode}/${lang}`;
  
  // Fetch megaplay iframe HTML to extract the data-id (episodeId)
  const resHtml = await fetch(playerIframeUrl, {
    headers: {
      'referer': 'https://anikage.cc/',
      'user-agent': USER_AGENT
    }
  });
  
  if (!resHtml.ok) {
    throw new Error(`Failed to load Megaplay player page: HTTP ${resHtml.status}`);
  }
  
  const html = await resHtml.text();
  
  // Extract data-id
  const dataIdMatch = html.match(/data-id="([^"]+)"/);
  if (!dataIdMatch) {
    throw new Error("Failed to extract data-id from Megaplay player");
  }
  
  const episodeId = dataIdMatch[1];
  
  // Fetch getSources JSON using the episodeId
  const getSourcesUrl = `https://megaplay.buzz/stream/getSources?id=${episodeId}`;
  const resSources = await fetch(getSourcesUrl, {
    headers: {
      'referer': playerIframeUrl,
      'user-agent': USER_AGENT,
      'accept': 'application/json, text/javascript, */*; q=0.01',
      'x-requested-with': 'XMLHttpRequest'
    }
  });
  
  if (!resSources.ok) {
    throw new Error(`Failed to fetch Megaplay sources: HTTP ${resSources.status}`);
  }
  
  const sourcesData: any = await resSources.json();
  
  return {
    iframeUrl: playerIframeUrl,
    episodeId: episodeId,
    sources: sourcesData.sources || null,
    tracks: sourcesData.tracks || [],
    intro: sourcesData.intro || { start: 0, end: 0 },
    outro: sourcesData.outro || { start: 0, end: 0 },
    server: sourcesData.server || null
  };
}
