import express from 'express';
import cors from 'cors';
import { errorHandler } from './utils/apiHelpers';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'FinTrackr API is running' });
});

app.use('/api', routes);

app.use(errorHandler);

export default app;
