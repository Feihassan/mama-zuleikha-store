# GlowHub E-commerce Store - Production Guide

## 🚀 Quick Start

### Development
```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend
npm run dev:full

# Or start individually
npm run dev          # Frontend only
npm run server:dev   # Backend only
```

### Production Deployment

#### 1. Environment Setup
```bash
# Backend environment (.env in server/)
DATABASE_URL=postgresql://user:pass@host:5432/database
NODE_ENV=production
PORT=3000
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
```

#### 2. Build & Deploy
```bash
# Build all components
npm run build:all

# Deploy using Docker
docker-compose up -d

# Or deploy manually
cd server && npm start
```

## 🏗️ Architecture

### Frontend (React + Vite)
- **Framework**: React 19 with Vite
- **Styling**: TailwindCSS + Framer Motion
- **State**: localStorage + React hooks
- **Routing**: React Router DOM

### Backend (Node.js + Express)
- **Runtime**: Node.js with Express
- **Database**: PostgreSQL with auto-initialization
- **Authentication**: Simple token-based auth
- **Payments**: M-Pesa STK Push integration
- **Security**: Helmet, CORS, Rate limiting

### Database Schema
```sql
-- Products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(500),
  category VARCHAR(100),
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  mpesa_checkout_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL
);
```

## 🔧 API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - List orders (admin)
- `GET /api/orders/:id` - Get single order
- `PATCH /api/orders/:id/status` - Update order status (admin)

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/admin/login` - Admin login (password: admin123)

### M-Pesa
- `POST /api/mpesa/stkpush` - Initiate STK push
- `POST /api/mpesa/callback` - Payment callback

## 🛡️ Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin protection
- **Rate Limiting**: 100 requests/15min in production
- **Input Validation**: SQL injection prevention
- **Authentication**: Token-based access control

## 📱 Features

### Customer Features
- Product browsing with filters and search
- Shopping cart with persistent storage
- Secure checkout with M-Pesa integration
- Order tracking system
- Responsive design for all devices

### Admin Features
- Product management (CRUD operations)
- Order management and status updates
- Real-time order notifications
- Sales analytics dashboard

## 🔄 Development Workflow

### Adding New Products
1. Access admin panel: `/admin/login` (password: admin123)
2. Navigate to "Manage Products"
3. Click "Add Product" and fill details
4. Products appear immediately on frontend

### Processing Orders
1. Orders created via checkout are stored in database
2. M-Pesa payments update order status automatically
3. Admin can manually update order status
4. Customers can track orders via order ID

### Database Management
- Database auto-initializes on first run
- Sample products inserted automatically
- Foreign key constraints ensure data integrity

## 🚢 Deployment Options

### Docker (Recommended)
```bash
docker-compose up -d
```

### Manual Deployment
```bash
# Backend
cd server
npm install
npm start

# Frontend (build and serve)
npm install
npm run build
npm run preview
```

### Cloud Deployment
- **Frontend**: Vercel, Netlify, or AWS S3
- **Backend**: Railway, Render, or AWS EC2
- **Database**: Render PostgreSQL, AWS RDS, or Supabase

## 🔍 Monitoring & Logs

### Backend Logs
```bash
# View server logs
tail -f server/server.log

# Database connection status
npm run test:db
```

### Frontend Analytics
- Cart abandonment tracking
- Product view analytics
- User journey mapping

## 🛠️ Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL format
   - Ensure PostgreSQL is running
   - Verify network connectivity

2. **M-Pesa Integration Issues**
   - Validate API credentials
   - Check callback URL configuration
   - Monitor payment status updates

3. **CORS Errors**
   - Update FRONTEND_URL in backend .env
   - Check allowed origins in server.js

4. **Build Failures**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify environment variables

### Performance Optimization
- Enable gzip compression (already configured)
- Use CDN for static assets
- Implement Redis caching for products
- Add database indexing for search queries

## 📊 Production Checklist

- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] M-Pesa credentials validated
- [ ] SSL certificate installed
- [ ] Domain name configured
- [ ] Backup strategy implemented
- [ ] Monitoring tools setup
- [ ] Error tracking enabled
- [ ] Performance metrics configured
- [ ] Security audit completed

## 🤝 Support

For technical support or deployment assistance:
- Check logs for error details
- Verify environment configuration
- Test API endpoints individually
- Monitor database connectivity

---

**Built with ❤️ for modern e-commerce**