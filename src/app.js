import express from 'express';
import tweetRoutes from './routes/tweet.route.js';
import geminiRotes from './routes/gemini.route.js';
import './jobs/scheduler.js'; // Load scheduled jobs

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/', tweetRoutes);
app.use('/', geminiRotes);

app.get('/', (_req, res) => {
  res.send('🚀 Gemini Tweet Scheduler is running!');
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
