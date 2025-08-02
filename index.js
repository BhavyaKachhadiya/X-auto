import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Initialize Twitter client
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
  clientId:process.env.ClientID,
  clientSecret:process.env.ClientSecret,

});

// Gemini prompt
const basePrompt = `You are a senior JavaScript engineer and expert content creator.
Each day, you write 1 original, insightful X (formerly Twitter) post (max 280 characters) to help intermediate-to-advanced JavaScript developers deepen their understanding.

Your post must:

- Focus on a unique JavaScript topic (avoid repeating previous topics)
- Be practical, thought-provoking, or educational
- Use a clean, professional tone — no clickbait, no emojis, no hashtags, no links

The tweet style can be:
- A concise tip or lesson
- A common pitfall or myth
- A best practice
- A real-world pattern or anti-pattern
- A question or mental model

Rotate through JS topics over time such as:
- Closures, scope, hoisting
- this, bind/call/apply
- Prototypes, objects, inheritance
- Promises, async/await, fetch
- ES6+ syntax and features
- Functional programming in JS
- Performance, memory, event loop
- Tooling (Babel, ESLint, etc.)

Ensure each post is unique and non-repeating, even when run daily.
Output only the tweet as plain text, no code formatting, no explanation.`;

// Fetch Gemini tweet
const fetchGeminiTweet = async () => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(basePrompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('❌ Gemini API error:', (error).message);
    return '[Error generating tweet]';
  }
};

// Route to generate and post tweet
app.get('/tweet', async (_req, res) => {
  const tweetText = await fetchGeminiTweet();

  if (tweetText.startsWith('[Error')) {
    return res.status(500).send('❌ Failed to generate tweet.');
  }

  try {
    const tweet = await twitterClient.v2.tweet(tweetText);
    console.log('✅ Tweet posted:', tweet);
    res.send(`✅ Tweet posted: ${tweet.data.id}`);
  } catch (error) {
    console.error('❌ Twitter API error:', (error).message);
    res.status(500).send('❌ Failed to post tweet.');
  }
});

// Health check
app.get('/', (_req, res) => {
  res.send('🚀 Gemini Tweet Scheduler is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
