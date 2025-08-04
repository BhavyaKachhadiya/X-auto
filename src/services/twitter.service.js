import { twitterClient } from '../config.js';

export async function postTweet(tweetText) {
  try {
    const result = await twitterClient.v2.tweet(tweetText);
    console.log('✅ Tweet posted:', tweetText);
    return result;
  } catch (error) {
    console.error('❌ Twitter API error:', error.message);
    throw error;
  }
}
