import express from 'express';
import cors from 'cors';
import { errorHandler } from './utils/apiHelpers';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request logger for debugging incoming requests
app.use((req, res, next) => {
  try {
    console.log(`[HTTP] ${req.method} ${req.originalUrl}`);
    console.log('Headers:', JSON.stringify(req.headers));
    // body might be large; log only when present
    if (req.body && Object.keys(req.body).length > 0) {
      console.log('Body:', JSON.stringify(req.body));
    }
  } catch (err) {
    console.log('Error logging request:', err);
  }
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'FinTrackr API is running' });
});

app.use('/api', routes);

app.use(errorHandler);

export default app;
