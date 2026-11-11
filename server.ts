import express from 'express';
import path from 'path';
import { apiRouter } from './src/server/api.ts';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', apiRouter);

// Serve static frontend build
app.use(express.static(path.resolve('dist')));
app.get('*', (_req, res) => {
  res.sendFile(path.resolve('dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`ZA Global Tech Institute server running on port ${PORT}`);
});
