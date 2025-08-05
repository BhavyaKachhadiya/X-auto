import express from 'express';
import { fetchGeminiTweet,fetchGeminiThread } from '../services/gemini.service.js';
import { postTweet, postTweetThread } from '../services/twitter.service.js';

const router = express.Router();

/**
 * GET /tweet
 * Posts a single tweet
 */
router.get('/tweet', async (_req, res) => {
  const tweetText = await fetchGeminiTweet();

  if (!tweetText || typeof tweetText !== 'string' || tweetText.startsWith('[Error')) {
    return res.status(500).send('❌ Failed to generate tweet.');
  }

  try {
    await postTweet(tweetText);
    res.send(`✅ Tweet posted:\n\n${tweetText}`);
  } catch (error) {
    console.error('❌ Failed to post tweet:', error);
    res.status(500).send('❌ Failed to post tweet.');
  }
});

/**
 * GET /thread
 * Posts a tweet thread
 */
router.get('/thread', async (_req, res) => {
  const thread = await fetchGeminiThread();
console.log("Hello ",thread)
  if (!Array.isArray(thread) || thread.length === 0) {
    return res.status(500).send('❌ Failed to generate thread.');
  }
  if (typeof thread[0] === 'string' && thread[0].startsWith('[Error')) {
  return res.status(500).send('❌ Failed to generate thread.');
}
  try {
    await postTweetThread(thread);
    const threadText = thread.map(t => (typeof t === 'string' ? t : t.text)).join('\n\n');
    res.send(`✅ Thread posted:\n\n${threadText}`);
  } catch (error) {
    console.error('❌ Failed to post thread:', error);
    res.status(500).send('❌ Failed to post thread.');
  }
});

export default router;
