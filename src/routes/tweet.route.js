import express from 'express';
import { fetchGeminiTweet } from '../services/gemini.service.js';
import { postTweet } from '../services/twitter.service.js';

const router = express.Router();

router.get('/tweet', async (_req, res) => {
  const tweetText = await fetchGeminiTweet();

  if (tweetText.startsWith('[Error')) {
    return res.status(500).send('❌ Failed to generate tweet.');
  }

  try {
    await postTweet(tweetText);
    res.send(`✅ Tweet posted:\n\n${tweetText}`);
  } catch {
    res.status(500).send('❌ Failed to post tweet.');
  }
});

export default router;
