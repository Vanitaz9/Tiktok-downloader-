require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { URL } = require('url');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Basic rate limiter to avoid abuse
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
  max: parseInt(process.env.RATE_LIMIT_MAX || '30'),
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

/**
 * Validate tiktok-like URL (basic check). Adjust regex as needed.
 * This only does simple validation — consider more robust checks in production.
 */
function isLikelyTikTokUrl(url) {
  try {
    const u = new URL(url);
    return /tiktok\.com|vt\.tiktok\.com/.test(u.hostname);
  } catch (e) {
    return false;
  }
}

/**
 * /api/download
 * body: { url: string }
 *
 * This endpoint forwards the request to a legal third-party provider (placeholder).
 * The provider should return downloadable content or a direct file link.
 *
 * IMPORTANT: Do not implement scraping or bypassing platform protections.
 */
app.post('/api/download', async (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing url in request body' });
  }
  if (!isLikelyTikTokUrl(url)) {
    return res.status(400).json({ error: 'Provided URL does not look like a TikTok URL' });
  }

  try {
    // Placeholder: call your legal provider here
    const providerUrl = process.env.THIRD_PARTY_API_URL;
    const apiKey = process.env.THIRD_PARTY_API_KEY;

    if (!providerUrl || !apiKey) {
      // Demo response: return simulated metadata (no video file)
      return res.json({
        demo: true,
        message:
          'This is a demo response. Configure THIRD_PARTY_API_URL and THIRD_PARTY_API_KEY in .env to enable real downloads.',
        title: 'Demo TikTok Video',
        thumbnail: '/placeholder-thumb.jpg',
        downloadable: false
      });
    }

    // Example provider call (adjust according to provider's API spec)
    // Many providers return JSON with a direct video URL you can proxy/redirect to.
    const providerResp = await axios.get(providerUrl, {
      params: { url },
      headers: { 'Authorization': `Bearer ${apiKey}` },
      timeout: 20000
    });

    // Example expected shape: { success: true, videoUrl: "...", title: "...", thumbnail: "..." }
    const data = providerResp.data;

    if (!data || !data.videoUrl) {
      return res.status(502).json({ error: 'Provider did not return a downloadable URL', raw: data });
    }

    // Option A: return provider video URL to frontend
    return res.json({
      success: true,
      title: data.title || null,
      thumbnail: data.thumbnail || null,
      videoUrl: data.videoUrl
    });

    // Option B (alternative): proxy the file through your server (stream)
    // If you prefer to stream the bytes to the client, implement streaming with axios responseType: 'stream'
    // and pipe to res. Beware: streaming large files uses bandwidth on your server.
  } catch (err) {
    console.error('Error in /api/download:', err.message || err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
