const express = require('express');
const cheerio = require('cheerio');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/videos', async (req, res) => {
  try {
    const response = await fetch('https://www.youtube.com/@inspiredByFlorian/videos');
    const body = await response.text();
    const $ = cheerio.load(body);
    const videoIds = new Set();

    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.startsWith('/watch?v=')) {
        const videoId = href.split('=')[1].split('&')[0];
        videoIds.add(videoId);
      }
    });

    res.json([...videoIds]);
  } catch (err) {
    res.status(500).send('Erreur scraping');
  }
});

app.listen(PORT, () => {
  console.log(`Scraper running on port ${PORT}`);
});
