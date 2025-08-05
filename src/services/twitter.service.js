import { twitterClient } from '../config.js';

/**
 * Posts a single tweet.
 * @param tweetText - The content of the tweet.
 */
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

/**
 * Posts a thread of tweets sequentially.
 * Each item in the array can be a string or an object with advanced options.
 * @param thread - Array of tweets (string or TweetV2PostTweetParams).
 */
export async function postTweetThread(thread) {
  try {
    const result = await twitterClient.v2.tweetThread(thread);
    console.log('✅ Thread posted with', thread.length, 'tweets.');
    return result;
  } catch (error) {
    console.error('❌ Twitter API thread error:', error.message);
    throw error;
  }
}
