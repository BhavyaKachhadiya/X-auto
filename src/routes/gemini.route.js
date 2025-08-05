import express from 'express';
import { fetchGeminiTweet,fetchGeminiThread } from '../services/gemini.service.js';

const router = express.Router();

router.get('/gemini', async (_req, res) => {
  const tweetText = await fetchGeminiTweet();

  if (tweetText.startsWith('[Error')) {
    return res.status(500).send('❌ Failed to generate tweet.');
  }
    
    res.send({"gemini":tweetText});
});

router.get('/gemini/thread', async (_req, res) => {
  const tweetText = await fetchGeminiThread();

  if (tweetText.startsWith('[Error')) {
    return res.status(500).send('❌ Failed to generate tweet.');
  }
    
    res.send(tweetText);
});

export default router;
