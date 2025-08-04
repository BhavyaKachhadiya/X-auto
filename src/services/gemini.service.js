import { genAI } from '../config.js';
import { basePrompt } from '../utils/prompt.js';

export async function fetchGeminiTweet() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(basePrompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('❌ Gemini error:', error.message);
    return '[Error generating tweet]';
  }
}
