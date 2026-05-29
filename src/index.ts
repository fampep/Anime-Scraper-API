import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import * as scraper from './scraper';
import { playerHtml } from './playerHtml';

const app = new Hono();

// Middlewares
app.use('*', cors());
app.use('*', prettyJSON());

// Error Handler
app.onError((err, c) => {
  console.error(err);
  return c.json({
    success: false,
    error: err.message || 'Internal Server Error'
  }, 500);
});

// Serve the Example Stream Player page
app.get('/player', (c) => {
  return c.html(playerHtml);
});

// Home page
app.get('/', (c) => {
  return c.json({
    name: 'Anikage Anime Scraper API',
    version: '1.0.0',
    description: 'A full-featured scraper API for anikage.cc, ready to deploy on Cloudflare Workers',
    endpoints: {
      search: '/api/search?q={query}&page={page}&perPage={perPage}',
      info: '/api/info?slug={slug}',
      episodes: '/api/episodes?slug={slug}',
      servers: '/api/servers?slug={slug}&episode={episodeNumber}',
      streams: '/api/streams?slug={slug}&episode={episodeNumber}&provider={provider}&lang={sub|dub}',
      megaplay: '/api/megaplay?anilistId={anilistId}&episode={episodeNumber}&lang={sub|dub}'
    }
  });
});

/**
 * 1. Search Anime
 */
app.get('/api/search', async (c) => {
  const query = c.req.query('q');
  const page = parseInt(c.req.query('page') || '1');
  const perPage = parseInt(c.req.query('perPage') || '25');
  
  if (!query) {
    return c.json({ success: false, error: 'Query parameter "q" is required.' }, 400);
  }
  
  const searchResults = await scraper.searchAnime(query, page, perPage);
  return c.json({
    success: true,
    data: searchResults
  });
});

/**
 * 2. Get Anime Layout Details / Metadata
 */
app.get('/api/info', async (c) => {
  const slug = c.req.query('slug');
  
  if (!slug) {
    return c.json({ success: false, error: 'Parameter "slug" is required.' }, 400);
  }
  
  const info = await scraper.getAnimeInfo(slug);
  return c.json({
    success: true,
    data: info
  });
});

/**
 * 3. Fetch Anime Episodes List
 */
app.get('/api/episodes', async (c) => {
  const slug = c.req.query('slug');
  
  if (!slug) {
    return c.json({ success: false, error: 'Parameter "slug" is required.' }, 400);
  }
  
  const episodes = await scraper.getEpisodes(slug);
  return c.json({
    success: true,
    total: episodes.length,
    data: episodes
  });
});

/**
 * 4. Fetch Anime Servers list for an episode
 */
app.get('/api/servers', async (c) => {
  const slug = c.req.query('slug');
  const episodeStr = c.req.query('episode');
  
  if (!slug || !episodeStr) {
    return c.json({ success: false, error: 'Parameters "slug" and "episode" are required.' }, 400);
  }
  
  const episode = parseInt(episodeStr);
  if (isNaN(episode)) {
    return c.json({ success: false, error: 'Parameter "episode" must be a valid integer.' }, 400);
  }
  
  const servers = await scraper.getServers(slug, episode);
  return c.json({
    success: true,
    data: servers
  });
});

/**
 * 5. Fetch Stream sources (decodes to prox.anikage.cc M3U8 links)
 */
app.get('/api/streams', async (c) => {
  const slug = c.req.query('slug');
  const episodeStr = c.req.query('episode');
  const provider = c.req.query('provider') || 'pahe';
  const lang = c.req.query('lang') || 'sub';
  
  if (!slug || !episodeStr) {
    return c.json({ success: false, error: 'Parameters "slug" and "episode" are required.' }, 400);
  }
  
  const episode = parseInt(episodeStr);
  if (isNaN(episode)) {
    return c.json({ success: false, error: 'Parameter "episode" must be a valid integer.' }, 400);
  }
  
  let streams = await scraper.getStreams(slug, episode, provider, lang);
  
  // Dynamic server fallback at API layer: if requested provider returns no streams, try alternative servers
  if ((!streams || !streams.sources || streams.sources.length === 0) && provider === 'pahe') {
    try {
      const servers = await scraper.getServers(slug, episode);
      if (Array.isArray(servers)) {
        for (const s of servers) {
          if (s.id !== 'pahe') {
            const fallbackStreams = await scraper.getStreams(slug, episode, s.id, lang);
            if (fallbackStreams && fallbackStreams.sources && fallbackStreams.sources.length > 0) {
              streams = fallbackStreams;
              break;
            }
          }
        }
      }
    } catch (err) {
      console.error("API stream fallback failed:", err);
    }
  }
  


  return c.json({
    success: true,
    data: streams
  });
});

/**
 * 6. Scrape Megaplay Player directly (returns iframe & decoded direct m3u8 link)
 */
app.get('/api/megaplay', async (c) => {
  const anilistIdStr = c.req.query('anilistId');
  const episodeStr = c.req.query('episode');
  const lang = c.req.query('lang') || 'sub';
  
  if (!anilistIdStr || !episodeStr) {
    return c.json({ success: false, error: 'Parameters "anilistId" and "episode" are required.' }, 400);
  }
  
  const anilistId = parseInt(anilistIdStr);
  const episode = parseInt(episodeStr);
  if (isNaN(anilistId) || isNaN(episode)) {
    return c.json({ success: false, error: 'Parameters "anilistId" and "episode" must be valid integers.' }, 400);
  }
  
  const megaplayData = await scraper.getMegaplayStream(anilistId, episode, lang);
  return c.json({
    success: true,
    data: megaplayData
  });
});

export default app;
