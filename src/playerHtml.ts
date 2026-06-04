export const playerHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Anikage Anime Stream Player</title>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet">
  <!-- HLS.js -->
  <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
  
  <style>
    :root {
      --bg-gradient: linear-gradient(135deg, #0b0a0f 0%, #12101a 100%);
      --panel-bg: rgba(20, 18, 30, 0.7);
      --border-color: rgba(255, 255, 255, 0.08);
      --accent-color: #8b5cf6;
      --accent-glow: rgba(139, 92, 246, 0.4);
      --text-main: #f3f4f6;
      --text-muted: #9ca3af;
      --card-bg: rgba(30, 27, 45, 0.5);
      --card-hover: rgba(45, 41, 66, 0.8);
      --success: #10b981;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Outfit', sans-serif;
      background: var(--bg-gradient);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
    }

    h1, h2, h3, .logo {
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
    }

    header {
      background: rgba(11, 10, 15, 0.8);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color);
      padding: 1rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .logo {
      font-size: 1.5rem;
      background: linear-gradient(45deg, #8b5cf6, #ec4899);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.5px;
    }

    .badge {
      background: rgba(139, 92, 246, 0.2);
      border: 1px solid var(--accent-color);
      color: var(--text-main);
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .search-box {
      display: flex;
      gap: 0.5rem;
      width: 100%;
      max-width: 500px;
    }

    .search-box input {
      flex: 1;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 0.6rem 1rem;
      color: var(--text-main);
      font-family: inherit;
      font-size: 0.95rem;
      transition: all 0.3s;
    }

    .search-box input:focus {
      outline: none;
      border-color: var(--accent-color);
      box-shadow: 0 0 10px var(--accent-glow);
      background: rgba(255, 255, 255, 0.08);
    }

    .search-box button {
      background: var(--accent-color);
      border: none;
      border-radius: 8px;
      color: white;
      padding: 0 1.2rem;
      font-family: inherit;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .search-box button:hover {
      background: #7c3aed;
      box-shadow: 0 0 15px var(--accent-glow);
    }

    .main-container {
      flex: 1;
      display: grid;
      grid-template-columns: 380px 1fr;
      padding: 2rem;
      gap: 2rem;
      max-width: 1600px;
      width: 100%;
      margin: 0 auto;
    }

    @media (max-width: 1024px) {
      .main-container {
        grid-template-columns: 1fr;
      }
    }

    .left-panel {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      max-height: calc(100vh - 120px);
      overflow-y: auto;
      padding-right: 0.5rem;
    }

    /* Scrollbar Styling */
    .left-panel::-webkit-scrollbar {
      width: 6px;
    }
    .left-panel::-webkit-scrollbar-track {
      background: transparent;
    }
    .left-panel::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
    }
    .left-panel::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .right-panel {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .panel-card {
      background: var(--panel-bg);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 1.5rem;
      backdrop-filter: blur(12px);
    }

    /* Search Results */
    .results-list {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }

    .anime-card {
      display: flex;
      gap: 1rem;
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 0.8rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .anime-card:hover {
      transform: translateY(-2px);
      background: var(--card-hover);
      border-color: var(--accent-color);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .anime-card.active {
      border-color: var(--accent-color);
      background: rgba(139, 92, 246, 0.1);
    }

    .anime-card img {
      width: 70px;
      height: 100px;
      object-fit: cover;
      border-radius: 6px;
    }

    .anime-card-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 0.3rem;
      min-width: 0;
    }

    .anime-card-title {
      font-size: 0.95rem;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .anime-card-meta {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    /* Video Player */
    .player-container {
      position: relative;
      width: 100%;
      background: black;
      border-radius: 12px;
      overflow: hidden;
      aspect-ratio: 16 / 9;
      border: 1px solid var(--border-color);
    }

    .player-container video {
      width: 100%;
      height: 100%;
      display: block;
    }

    .player-placeholder {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      background: radial-gradient(circle, #1a1528 0%, #08070d 100%);
      color: var(--text-muted);
      text-align: center;
      padding: 2rem;
    }

    .player-placeholder svg {
      width: 64px;
      height: 64px;
      fill: var(--accent-color);
      filter: drop-shadow(0 0 10px var(--accent-glow));
    }

    /* Selectors */
    .selector-row {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-top: 1rem;
    }

    .selector-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      flex: 1;
      min-width: 180px;
    }

    .selector-label {
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-muted);
    }

    .custom-select {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 0.5rem;
      color: var(--text-main);
      font-family: inherit;
      outline: none;
      cursor: pointer;
      transition: border-color 0.3s;
    }

    .custom-select:focus {
      border-color: var(--accent-color);
    }

    /* Episodes Grid */
    .episodes-section {
      margin-top: 1rem;
    }

    .episodes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
      gap: 0.6rem;
      margin-top: 0.8rem;
      max-height: 250px;
      overflow-y: auto;
      padding-right: 0.2rem;
    }

    .ep-btn {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 0.5rem 0;
      color: var(--text-main);
      font-family: inherit;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .ep-btn:hover {
      background: rgba(139, 92, 246, 0.2);
      border-color: var(--accent-color);
    }

    .ep-btn.active {
      background: var(--accent-color);
      border-color: var(--accent-color);
      box-shadow: 0 0 10px var(--accent-glow);
    }

    /* Anime Info Panel */
    .anime-detail-header {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 1rem;
    }

    .anime-detail-header img {
      width: 100px;
      height: 140px;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid var(--border-color);
    }

    .anime-detail-meta {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      justify-content: center;
    }

    .anime-detail-title {
      font-size: 1.4rem;
      font-weight: 800;
      line-height: 1.2;
    }

    .genre-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-top: 0.4rem;
    }

    .genre-tag {
      background: rgba(255, 255, 255, 0.06);
      border-radius: 4px;
      padding: 0.15rem 0.4rem;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .synopsis {
      font-size: 0.9rem;
      line-height: 1.6;
      color: var(--text-muted);
      margin-top: 1rem;
    }

    /* Logs & Debug Section */
    .debug-console {
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 0.8rem;
      font-family: 'Space Grotesk', monospace;
      font-size: 0.8rem;
      max-height: 120px;
      overflow-y: auto;
      margin-top: 1rem;
    }

    .debug-line {
      margin-bottom: 0.3rem;
      display: flex;
      gap: 0.5rem;
    }

    .debug-time {
      color: var(--accent-color);
    }

    .debug-msg {
      color: var(--text-muted);
    }

    .debug-msg.info {
      color: var(--text-main);
    }

    .debug-msg.success {
      color: var(--success);
    }

    .debug-msg.error {
      color: #ef4444;
    }
  </style>
</head>
<body>

  <header>
    <div class="logo-container">
      <span class="logo">Anikage Stream API</span>
      <span class="badge">PROXIED PLAYER</span>
    </div>
    <div class="search-box">
      <input type="text" id="searchInput" placeholder="Search anime... (e.g. Solo Leveling, Re:Zero)" value="Solo Leveling" />
      <button id="searchBtn">Search</button>
    </div>
  </header>

  <div class="main-container">
    
    <!-- Left panel (Search results, Info) -->
    <div class="left-panel">
      
      <!-- Search Results Card -->
      <div class="panel-card">
        <h3 style="margin-bottom: 1rem; font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">Search Results</h3>
        <div id="resultsList" class="results-list">
          <div style="color: var(--text-muted); text-align: center; padding: 2rem;">Search for an anime above to begin.</div>
        </div>
      </div>
      
    </div>

    <!-- Right panel (Video Player & Info Detail) -->
    <div class="right-panel">
      
      <!-- Video player card -->
      <div class="panel-card" style="padding: 1rem;">
        <div class="player-container">
          <video id="videoPlayer" controls crossorigin="anonymous"></video>
          <div id="playerPlaceholder" class="player-placeholder">
            <svg viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <h2 id="placeholderText">No Episode Loaded</h2>
            <p>Select an anime and an episode to start streaming</p>
          </div>
        </div>
        
        <!-- Server / Sub Selector Row -->
        <div class="selector-row">
          <div class="selector-group">
            <span class="selector-label">Server / Player</span>
            <select id="serverSelect" class="custom-select">
              <option value="auto">Auto Selection (Best Stream)</option>
              <option value="megaplay">Megaplay (CDN M3U8)</option>
            </select>
          </div>
          
          <div class="selector-group">
            <span class="selector-label">Language Type</span>
            <select id="langSelect" class="custom-select">
              <option value="sub">Subtitled (Sub)</option>
              <option value="dub">English Dubbed (Dub)</option>
            </select>
          </div>
        </div>

        <div id="debugConsole" class="debug-console">
          <div class="debug-line">
            <span class="debug-time">[System]</span>
            <span class="debug-msg success">Stream Player initialized. Ready.</span>
          </div>
        </div>
      </div>

      <!-- Episode selection list card -->
      <div class="panel-card">
        <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">Episodes Selection</h3>
        <div class="episodes-section">
          <div id="episodesGrid" class="episodes-grid">
            <div style="color: var(--text-muted); text-align: center; width: 100%; grid-column: 1 / -1; padding: 1.5rem;">No anime selected.</div>
          </div>
        </div>
      </div>

      <!-- Selected Anime Info Detail -->
      <div id="animeDetailCard" class="panel-card" style="display: none;">
        <div class="anime-detail-header">
          <img id="detailCover" src="" alt="Cover" />
          <div class="anime-detail-meta">
            <h2 id="detailTitle" class="anime-detail-title">Anime Title</h2>
            <div class="genre-container" id="detailGenres"></div>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem;">
              Status: <span id="detailStatus" style="color: var(--text-main); font-weight: 600;">-</span> | 
              Episodes: <span id="detailTotalEp" style="color: var(--text-main); font-weight: 600;">-</span>
            </div>
          </div>
        </div>
        <p id="detailSynopsis" class="synopsis"></p>
      </div>

    </div>

  </div>

  <script>
    let activeAnime = null;
    let activeEpisodes = [];
    let activeEpisodeNum = null;
    let hls = null;

    // Elements
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const resultsList = document.getElementById('resultsList');
    const episodesGrid = document.getElementById('episodesGrid');
    const videoPlayer = document.getElementById('videoPlayer');
    const playerPlaceholder = document.getElementById('playerPlaceholder');
    const placeholderText = document.getElementById('placeholderText');
    const animeDetailCard = document.getElementById('animeDetailCard');
    
    const detailTitle = document.getElementById('detailTitle');
    const detailCover = document.getElementById('detailCover');
    const detailGenres = document.getElementById('detailGenres');
    const detailStatus = document.getElementById('detailStatus');
    const detailTotalEp = document.getElementById('detailTotalEp');
    const detailSynopsis = document.getElementById('detailSynopsis');
    
    const serverSelect = document.getElementById('serverSelect');
    const langSelect = document.getElementById('langSelect');
    const debugConsole = document.getElementById('debugConsole');

    function log(message, type = 'info') {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const line = document.createElement('div');
      line.className = 'debug-line';
      line.innerHTML = \`<span class="debug-line">[\${timeStr}]</span> <span class="debug-msg \${type}">\${message}</span>\`;
      debugConsole.appendChild(line);
      debugConsole.scrollTop = debugConsole.scrollHeight;
    }

    function updateServerSelect(serversList, currentSelected) {
      const previousValue = currentSelected || serverSelect.value || 'auto';
      
      // Clear options
      serverSelect.innerHTML = '';
      
      // Add Auto option
      const autoOpt = document.createElement('option');
      autoOpt.value = 'auto';
      autoOpt.textContent = 'Auto Selection (Best Stream)';
      serverSelect.appendChild(autoOpt);
      
      // Add each dynamic server
      serversList.forEach(s => {
        if (s.id !== 'pahe') {
          const opt = document.createElement('option');
          opt.value = s.id;
          opt.textContent = \`\${s.id.toUpperCase()} Server\${s.default ? ' (Default)' : ''}\`;
          serverSelect.appendChild(opt);
        }
      });
      
      // Add Megaplay option
      const mpOpt = document.createElement('option');
      mpOpt.value = 'megaplay';
      mpOpt.textContent = 'Megaplay (CDN M3U8)';
      serverSelect.appendChild(mpOpt);
      
      // Restore selection if it exists in the new options list
      let hasPrevious = Array.from(serverSelect.options).some(o => o.value === previousValue);
      if (hasPrevious) {
        serverSelect.value = previousValue;
      } else {
        serverSelect.value = 'auto';
      }
    }

    // Load initial search on page mount
    window.addEventListener('DOMContentLoaded', () => {
      performSearch(searchInput.value);
    });

    searchBtn.addEventListener('click', () => {
      performSearch(searchInput.value);
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') performSearch(searchInput.value);
    });

    serverSelect.addEventListener('change', () => {
      if (activeEpisodeNum) playEpisode(activeEpisodeNum);
    });

    langSelect.addEventListener('change', () => {
      if (activeEpisodeNum) playEpisode(activeEpisodeNum);
    });

    async function performSearch(query) {
      if (!query.trim()) return;
      
      log(\`Searching for: "\${query}"...\`);
      resultsList.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 2rem;">Searching...</div>';
      
      try {
        const res = await fetch(\`/api/search?q=\${encodeURIComponent(query)}\`);
        const json = await res.json();
        
        if (!json.success || !json.data || !json.data.results || json.data.results.length === 0) {
          resultsList.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 2rem;">No results found.</div>';
          log("Search returned no results.", 'error');
          return;
        }
        
        log(\`Found \${json.data.results.length} anime results.\`, 'success');
        renderSearchResults(json.data.results);
      } catch (err) {
        log(\`Search failed: \${err.message}\`, 'error');
        resultsList.innerHTML = '<div style="color: red; text-align: center; padding: 2rem;">Failed to fetch search results.</div>';
      }
    }

    function renderSearchResults(results) {
      resultsList.innerHTML = '';
      results.forEach((anime, idx) => {
        const card = document.createElement('div');
        card.className = 'anime-card';
        if (activeAnime && activeAnime.slug === anime.slug) card.className += ' active';
        
        const cover = anime.coverImage.medium || anime.coverImage.large || 'https://via.placeholder.com/70x100?text=No+Cover';
        const genresStr = anime.genres.slice(0, 3).join(', ');
        
        card.innerHTML = \`
          <img src="\${cover}" alt="Cover" />
          <div class="anime-card-info">
            <div class="anime-card-title">\${anime.title.english || anime.title.romaji}</div>
            <div class="anime-card-meta">\${anime.format || 'TV'} | Rating: \${anime.averageScore || 'N/A'}/100</div>
            <div class="anime-card-meta" style="font-size: 0.75rem;">\${genresStr}</div>
          </div>
        \`;
        
        card.addEventListener('click', () => {
          document.querySelectorAll('.anime-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          selectAnime(anime);
        });
        
        resultsList.appendChild(card);
        
        // Auto-select first item on initial search
        if (idx === 0 && !activeAnime) {
          card.classList.add('active');
          selectAnime(anime);
        }
      });
    }

    async function selectAnime(anime) {
      activeAnime = anime;
      log(\`Selected: \${anime.title.english || anime.title.romaji}\`, 'info');
      
      // Update Detail UI
      animeDetailCard.style.display = 'block';
      detailTitle.textContent = anime.title.english || anime.title.romaji;
      detailCover.src = anime.coverImage.large || anime.coverImage.medium;
      detailStatus.textContent = anime.status;
      detailTotalEp.textContent = anime.totalEpisodes || 'Unknown';
      detailSynopsis.innerHTML = anime.description || 'No description available.';
      
      // Render Genres
      detailGenres.innerHTML = '';
      anime.genres.forEach(g => {
        const tag = document.createElement('span');
        tag.className = 'genre-tag';
        tag.textContent = g;
        detailGenres.appendChild(tag);
      });

      // Load Episodes
      log("Loading episodes list...");
      episodesGrid.innerHTML = '<div style="color: var(--text-muted); text-align: center; width: 100%; grid-column: 1 / -1; padding: 1.5rem;">Loading episodes...</div>';
      
      try {
        const res = await fetch(\`/api/episodes?slug=\${anime.slug}\`);
        const json = await res.json();
        
        if (!json.success || !json.data || json.data.length === 0) {
          episodesGrid.innerHTML = '<div style="color: var(--text-muted); text-align: center; width: 100%; grid-column: 1 / -1; padding: 1.5rem;">No episodes available.</div>';
          log("No episodes returned.", 'error');
          return;
        }
        
        activeEpisodes = json.data;
        log(\`Loaded \${activeEpisodes.length} episodes.\`, 'success');
        renderEpisodesGrid(activeEpisodes);
      } catch (err) {
        log(\`Failed to load episodes: \${err.message}\`, 'error');
        episodesGrid.innerHTML = '<div style="color: red; text-align: center; width: 100%; grid-column: 1 / -1; padding: 1.5rem;">Failed to load episodes list.</div>';
      }
    }

    function renderEpisodesGrid(episodes) {
      episodesGrid.innerHTML = '';
      episodes.forEach(ep => {
        const btn = document.createElement('button');
        btn.className = 'ep-btn';
        if (activeEpisodeNum === ep.number) btn.className += ' active';
        btn.textContent = ep.number;
        
        btn.addEventListener('click', () => {
          document.querySelectorAll('.ep-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          playEpisode(ep.number);
        });
        
        episodesGrid.appendChild(btn);
      });
    }

    async function playEpisode(episodeNum) {
      activeEpisodeNum = episodeNum;
      let provider = serverSelect.value;
      const lang = langSelect.value;
      let mediaRecoveryAttempts = 0;
      
      log(\`Loading Episode \${episodeNum} via \${provider} (\${lang})...\`);
      
      // Show loading/hiding player
      playerPlaceholder.style.display = 'flex';
      placeholderText.textContent = \`Loading Episode \${episodeNum}...\`;
      videoPlayer.style.display = 'none';
      
      if (hls) {
        hls.destroy();
        hls = null;
      }
      videoPlayer.src = '';

      try {
        let streamUrl = '';
        let subtitles = [];

        // 1. Fetch available servers list to populate dropdown dynamically
        try {
          const serversRes = await fetch(\`/api/servers?slug=\${activeAnime.slug}&episode=\${episodeNum}\`);
          const serversJson = await serversRes.json();
          if (serversJson.success && Array.isArray(serversJson.data)) {
            updateServerSelect(serversJson.data, provider);
            // Re-read provider since updateServerSelect might have reset it to auto
            provider = serverSelect.value;
          }
        } catch (err) {
          log(\`Failed to fetch servers list: \${err.message}\`, 'info');
        }

        if (provider === 'megaplay') {
          // Fetch from Megaplay player direct scraper
          if (!activeAnime.anilistId) {
            throw new Error("This anime has no AniList ID mapping, required for Megaplay.");
          }
          
          const res = await fetch(\`/api/megaplay?anilistId=\${activeAnime.anilistId}&episode=\${episodeNum}&lang=\${lang}\`);
          const json = await res.json();
          
          if (!json.success || !json.data || !json.data.sources || !json.data.sources.file) {
            throw new Error(json.error || "No streaming sources returned from Megaplay.");
          }
          
          streamUrl = json.data.sources.file;
          if (json.data.tracks) {
            subtitles = json.data.tracks.filter(t => t.kind === 'captions' || t.kind === 'subtitles');
          }
        } else {
          // 2. Fetch standard streams (Auto or specific provider like miko, anya, etc.)
          let resUrl = \`/api/streams?slug=\${activeAnime.slug}&episode=\${episodeNum}&lang=\${lang}\`;
          if (provider && provider !== 'auto') {
            resUrl += \`&provider=\${provider}\`;
          }
          
          log(\`Querying stream links for provider "\${provider}"...\`, 'info');
          const res = await fetch(resUrl);
          const json = await res.json();
          if (json.success && json.data && json.data.sources && json.data.sources.length > 0) {
            streamUrl = json.data.sources[0].streamUrl;
            if (json.data.subtitles) {
              subtitles = json.data.subtitles.filter(t => t.kind === 'captions' || t.kind === 'subtitles');
            }
            log(\`Successfully loaded stream from provider "\${provider}"!\`, 'success');
          } else {
            throw new Error(json.error || \`Provider "\${provider}" returned no stream links.\`);
          }
        }

        if (!streamUrl) {
          throw new Error("Failed to resolve stream URL.");
        }

        log(\`Stream URL resolved: \${streamUrl.split('?')[0]}\`, 'info');
        
        // Hide placeholder and show video
        playerPlaceholder.style.display = 'none';
        videoPlayer.style.display = 'block';

        // Load subtitles if any (specifically for Megaplay)
        // Clear any old track elements
        while (videoPlayer.firstChild) {
          videoPlayer.removeChild(videoPlayer.firstChild);
        }
        subtitles.forEach((sub, i) => {
          const track = document.createElement('track');
          track.kind = 'subtitles';
          track.label = sub.label || \`Subtitle \${i+1}\`;
          track.srclang = sub.label ? sub.label.slice(0, 2).toLowerCase() : 'en';
          track.src = sub.file;
          if (sub.default) track.default = true;
          videoPlayer.appendChild(track);
          log(\`Loaded subtitle track: \${sub.label}\`, 'info');
        });

        // Initialize Player HLS
        if (Hls.isSupported() && streamUrl.endsWith('.m3u8') || streamUrl.includes('index.txt') || streamUrl.includes('m3u8')) {
          log("Hls.js is supported. Initializing player context...", 'info');
          hls = new Hls({
            enableWorker: false // Runs demuxing in main thread to avoid web worker codec sandboxing issues
          });
          
          hls.loadSource(streamUrl);
          hls.attachMedia(videoPlayer);
          
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            log("M3U8 HLS Manifest parsed successfully! Starting video...", 'success');
            videoPlayer.play().catch(e => {
              log("Autoplay blocked. Press play button to start.", 'info');
            });
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              log(\`HLS Fatal Error: \${data.type} - \${data.details}\`, 'error');
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  log("Fatal network error! Trying fallback to Megaplay...", 'error');
                  if (serverSelect.value === 'pahe') {
                    serverSelect.value = 'megaplay';
                    log("Switched to Megaplay Server automatically.", 'success');
                    playEpisode(activeEpisodeNum);
                  } else {
                    hls.startLoad();
                  }
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  mediaRecoveryAttempts++;
                  if (mediaRecoveryAttempts <= 2) {
                    log(\`Fatal media error (Attempt \${mediaRecoveryAttempts}/2). Attempting to recover...\`, 'info');
                    hls.recoverMediaError();
                  } else {
                    log("Fatal media error recovery failed. Switching fallback to Megaplay...", 'error');
                    if (serverSelect.value === 'pahe') {
                      serverSelect.value = 'megaplay';
                      log("Switched to Megaplay Server automatically.", 'success');
                      playEpisode(activeEpisodeNum);
                    } else {
                      destroyPlayerAndShowError("Streaming playback failed due to consecutive fatal media errors.");
                    }
                  }
                  break;
                default:
                  log("Unrecoverable error. Cannot play video.", 'error');
                  destroyPlayerAndShowError("Streaming playback failed due to a fatal HLS error.");
                  break;
              }
            } else {
              // Non-fatal errors, can ignore
              console.warn("HLS Non-fatal error:", data.details);
            }
          });
        } 
        // For Safari / iOS native HLS support
        else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
          log("Native Safari HLS streaming detected. Loading src...", 'info');
          videoPlayer.src = streamUrl;
          videoPlayer.addEventListener('loadedmetadata', () => {
            log("Native HLS Metadata loaded successfully. Starting video...", 'success');
            videoPlayer.play().catch(e => {
              log("Autoplay blocked. Press play button.", 'info');
            });
          });
        } 
        else {
          log("Your browser does not support HLS streaming (.m3u8).", 'error');
          throw new Error("Browser does not support HLS playback.");
        }

      } catch (err) {
        log(\`Playback failed: \${err.message}\`, 'error');
        destroyPlayerAndShowError(err.message);
      }
    }

    function destroyPlayerAndShowError(errorMessage) {
      if (hls) {
        hls.destroy();
        hls = null;
      }
      videoPlayer.src = '';
      videoPlayer.style.display = 'none';
      playerPlaceholder.style.display = 'flex';
      placeholderText.textContent = "Playback Error";
      log(\`Visual alert: \${errorMessage}\`, 'error');
    }
  </script>
</body>
</html>
`;
