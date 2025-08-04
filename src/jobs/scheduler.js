import cron from 'node-cron';
import { fetchGeminiTweet } from '../services/gemini.service.js';
import { postTweet } from '../services/twitter.service.js';

const schedules = [
  { label: 'Morning', cronTime: '30 3 * * *' },   // 9 AM IST
  { label: 'Noon',    cronTime: '30 6 * * *' },   // 12 PM IST
  { label: 'Evening', cronTime: '30 9 * * *' },   // 3 PM IST
];

schedules.forEach(({ label, cronTime }) => {
  cron.schedule(cronTime, async () => {
    console.log(`🕒 ${label} Tweet - triggered`);
    const tweetText = await fetchGeminiTweet();

    if (tweetText.startsWith('[Error')) return;

    try {
      await postTweet(tweetText);
    } catch {
      console.error(`❌ Failed to post ${label} tweet.`);
    }
  });
});
