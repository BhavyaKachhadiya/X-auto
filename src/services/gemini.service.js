import { genAI } from '../config.js';
import { basePrompt, threadPrompt} from '../utils/prompt.js';

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

export async function fetchGeminiThread() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent(threadPrompt);
    const raw = await result.response.text();
    console.log("Raw Gemini response:", raw);

    // Try to extract and parse a JSON array from the raw text
    const jsonLike = raw.trim().match(/\[.*\]/s)?.[0]; // Extract array part

    if (!jsonLike) {
      throw new Error('No valid array found in Gemini response');
    }

    const thread = JSON.parse(jsonLike);

    if (!Array.isArray(thread) || thread.length !== 3) {
      throw new Error('Expected array of 3 tweets');
    }

    return thread.map(t => t.trim());

  } catch (error) {
    console.error('❌ Gemini thread error:', error.message);
    return ['[Error generating thread]'];
  }
}
