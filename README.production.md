# GlowHub - Production Deployment Guide

## 🚀 Production Features

### Security
- ✅ Helmet.js security headers
- ✅ Rate limiting (100 req/15min)
- ✅ CORS configuration
- ✅ Input validation & sanitization
- ✅ JWT authentication
- ✅ SQL injection protection
- ✅ XSS protection

### Performance
- ✅ Gzip compression
- ✅ Static asset caching
- ✅ Database connection pooling
- ✅ Request logging
- ✅ Health checks

### Monitoring
- ✅ Error logging
- ✅ Request monitoring
- ✅ Health endpoints
- ✅ Graceful shutdown

## 🔧 Environment Setup

1. **Copy environment template:**
```bash
cp server/.env.example server/.env
```

2. **Configure production variables:**
```env
DATABASE_URL=postgresql://user:pass@host:5432/glowhub_prod
JWT_SECRET=your-256-bit-secret-key
MPESA_CONSUMER_KEY=your-production-key
MPESA_CONSUMER_SECRET=your-production-secret
ADMIN_PASSWORD=secure-admin-password
FRONTEND_URL=https://yourdomain.com
NODE_ENV=production
```

## 🐳 Docker Deployment

1. **Build and run:**
```bash
docker-compose up -d
```

2. **View logs:**
```bash
docker-compose logs -f
```

## 🌐 Manual Deployment

### Backend (Render/Railway/Heroku)
```bash
cd server
npm install
npm run prod
```

### Frontend (Vercel/Netlify)
```bash
npm run build:prod
# Deploy dist/ folder
```

## 📊 Monitoring

- **Health Check:** `GET /`
- **API Status:** `GET /api/products`
- **Logs:** Check server logs for errors

## 🔒 Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secret (256-bit)
- [ ] Enable HTTPS in production
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Monitor error logs
- [ ] Update dependencies regularly

## 📈 Performance Optimization

- [ ] Enable CDN for static assets
- [ ] Set up database read replicas
- [ ] Implement Redis caching
- [ ] Monitor response times
- [ ] Set up auto-scaling

## 🚨 Troubleshooting

**Database Connection Issues:**
- Check DATABASE_URL format
- Verify network connectivity
- Check PostgreSQL logs

**M-Pesa Integration:**
- Verify sandbox vs production URLs
- Check API credentials
- Monitor callback logs

**CORS Errors:**
- Update FRONTEND_URL in .env
- Check allowed origins