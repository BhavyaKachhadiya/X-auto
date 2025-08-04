import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TwitterApi } from 'twitter-api-v2';

dotenv.config();

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
  clientId: process.env.ClientID,
  clientSecret: process.env.ClientSecret,
});
