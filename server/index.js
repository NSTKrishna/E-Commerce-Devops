const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const logger = require('./middleware/logger.middleware');
const { notFound, errorHandler } = require('./middleware/error.middleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.send('E-Commerce API is running');
});

const authRoutes = require('./routes/auth.routes');

app.use('/api/auth', authRoutes);
app.use('/api/requests', require('./routes/request.routes'));
app.use('/api/offers', require('./routes/offer.routes'));

app.use(notFound);
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
