import { EUploadMimeType } from 'twitter-api-v2';
import { twitterClient } from '../config.js';
import fetch from 'node-fetch';
/**
 * Posts a single tweet.
 * @param tweetText - The content of the tweet.
 */
export async function postTweet(tweetText) {
  try {
    // Encode the OG image URL
    const ogImageUrl = `https://x-auto-og.vercel.app/api/og?post=${encodeURIComponent(tweetText)}`;

    // Download the image from the OG endpoint
    const res = await fetch(ogImageUrl);
    if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);
    const arrayBuffer = await res.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);
    console.log("image",imageBuffer);


    // Upload image to Twitter using the v2 client
    const mediaId = await twitterClient.v2.uploadMedia(imageBuffer,{
      media_type:EUploadMimeType.Png,
      media_category:"tweet_image",
    })
    console.log("Media",mediaId)
    // Post tweet with media
    const result = await twitterClient.v2.tweet({
      text: tweetText,
      media: {
        media_ids: [mediaId]
      },
    });

    console.log('✅ Tweet posted with image:', tweetText);
    return mediaId;
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
