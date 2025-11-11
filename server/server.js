import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import './db.js';
import { mpesaRoutes } from './routes/mpesa.js';
import { orderRoutes } from './routes/orders.js';
import { productRoutes } from './routes/products.js';
import { authRoutes } from './routes/auth.js';
import { healthRoutes } from './routes/health.js';
import { reviewRoutes } from './routes/reviews.js';
import { contactRoutes } from './routes/contact.js';
import { cleanExpiredTokens } from './utils/jwt.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security middleware
app.use(helmet({
  contentSecurityPolicy: NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false,
  frameguard: { action: 'deny' } // X-Frame-Options: DENY
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: NODE_ENV === 'production' ? 100 : 1000,
  message: { error: 'Too many requests' }
});
app.use(limiter);

// CORS
const corsOptions = {
  origin: NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || false
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
};
app.use(cors(corsOptions));

// Compression and logging
app.use(compression());
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing and cookies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'GlowHub API Server', 
    status: 'running',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/mpesa', mpesaRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact', contactRoutes);

// Global error handler
app.use((err, req, res, _next) => {
  console.error('Error:', err);
  
  if (NODE_ENV === 'production') {
    res.status(500).json({ error: 'Internal server error' });
  } else {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

// Clean expired tokens periodically
setInterval(cleanExpiredTokens, 60 * 60 * 1000); // Every hour

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
  if (NODE_ENV === 'development') {
    console.log(`📱 Frontend: http://localhost:5173`);
    console.log(`🔧 API: http://localhost:${PORT}`);
    console.log(`👤 Admin: ${process.env.ADMIN_EMAIL || 'admin@glowhub.com'} / ${process.env.ADMIN_PASSWORD || 'admin123'}`);
  }
});