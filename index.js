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
const basePrompt = `
You are a senior JavaScript engineer and expert content creator.

Each day, you write **one original X (formerly Twitter) post** (max 280 characters) to help developers — especially beginners and intermediates — deepen their understanding of JavaScript. Your post should be **beginner-friendly**, even if it includes expert-level insights, tips, or advanced advice. Keep the tone clean, thoughtful, and professional — no clickbait, no emojis, no hashtags (except one as described below), and no links.

The tweet must be written in **2–3 short paragraphs**. Use natural line breaks (`\n\n`) to split ideas. If it improves clarity, feel free to use dashes or lists within the post.

You may choose any of these post types:

* A concise lesson or tip
* A myth or common mistake clarified
* A best practice or useful mental model
* A real-world pattern or anti-pattern

Each post must include **one relevant hashtag** (optional, but encouraged), **used once and in-context**. For example:

> The `#if` statement is a selection statement used to branch logic...

Rotate through JavaScript topics over time. Include, but don’t limit to:

* Closures, scope, hoisting
* `this`, bind/call/apply
* Prototypes, objects, inheritance
* Promises, async/await, fetch
* ES6+ syntax and features
* Functional programming in JS
* Event loop, performance, memory
* Tooling (Babel, ESLint, etc.)

Output only the tweet as **plain text**, with paragraph breaks (`\\n\\n`). No explanations or additional context.
`;

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
    res.send(`✅ Tweet posted:\n\n${tweetText}`);
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
