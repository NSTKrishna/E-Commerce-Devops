const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const logger = require('./middleware/logger.middleware');
const { notFound, errorHandler } = require('./middleware/error.middleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:3000',
  'https://e-commerce-nu-ten-77.vercel.app',
  'http://54.81.5.46:3000'
].map(origin => origin.replace(/\/$/, ''));

if (process.env.FRONTEND_URL) {
  const envOrigins = process.env.FRONTEND_URL.split(',').map(o => o.trim().replace(/\/$/, ''));
  allowedOrigins.push(...envOrigins);
}

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const sanitizedOrigin = origin.trim().replace(/\/$/, '');
    if (allowedOrigins.indexOf(sanitizedOrigin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));
app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.send('E-Commerce API is running');
});

// Health check endpoint for Docker & ECS
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

const authRoutes = require('./routes/auth.routes');

app.use('/api/auth', authRoutes);
app.use('/api/requests', require('./routes/request.routes'));
app.use('/api/offers', require('./routes/offer.routes'));

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
