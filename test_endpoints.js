async function test() {
  const base = 'http://localhost:8787';
  const urls = [
    '/',
    '/api/search?q=Solo+Leveling',
    '/api/info?slug=pQQW8nsEXr',
    '/api/episodes?slug=pQQW8nsEXr',
    '/api/servers?slug=pQQW8nsEXr&episode=1',
    '/api/streams?slug=pQQW8nsEXr&episode=1&provider=pahe&lang=sub',
    '/api/megaplay?anilistId=189046&episode=7&lang=sub'
  ];
  
  // Wait a moment for server to bind
  console.log("Waiting 3 seconds for wrangler dev server to boot up...");
  await new Promise(r => setTimeout(r, 3000));
  
  for (const path of urls) {
    const url = base + path;
    console.log(`\n========================================`);
    console.log(`Testing: ${url}`);
    console.log(`========================================`);
    try {
      const res = await fetch(url);
      console.log(`Status: ${res.status} ${res.statusText}`);
      if (res.status === 200) {
        const json = await res.json();
        console.log("Success! Previewing JSON keys:", Object.keys(json));
        if (json.data) {
          if (Array.isArray(json.data)) {
            console.log(`Array length: ${json.data.length}`);
            console.log("First element keys:", Object.keys(json.data[0] || {}));
            console.log("First element preview:", JSON.stringify(json.data[0]).slice(0, 500));
          } else {
            console.log("Object keys:", Object.keys(json.data));
            console.log("Object preview:", JSON.stringify(json.data).slice(0, 500));
          }
        } else {
          console.log("Response:", JSON.stringify(json).slice(0, 500));
        }
      } else {
        const text = await res.text();
        console.log("Error response body:", text.slice(0, 500));
      }
    } catch (err) {
      console.error("Fetch failed:", err.message);
    }
  }
}

test();
