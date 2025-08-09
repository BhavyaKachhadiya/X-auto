import express from 'express';
import { fetchGeminiTweet,fetchGeminiThread } from '../services/gemini.service.js';
import { postTweet, postTweetThread } from '../services/twitter.service.js';

const router = express.Router();

/**
 * GET /tweet
 * Posts a single tweet
 */
router.get('/tweet', async (_req, res) => {
  try {
    const tweetText = await fetchGeminiTweet();

    if (!tweetText || typeof tweetText !== 'string' || tweetText.startsWith('[Error')) {
      console.error('❌ Invalid tweet text:', tweetText);
      return res.status(500).json({
        ok: false,
        error: 'Failed to generate tweet',
        generatedText: tweetText,
      });
    }

    console.log('✍️ Generated tweet:', tweetText);

    await postTweet(tweetText);

    return res.status(200).json({
      ok: true,
      message: 'Tweet posted successfully',
      tweet: tweetText,
    });

  } catch (error) {
    console.error('❌ Failed to post tweet:', error);
    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
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
