import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './db.js'; // Initialize database connection
import { mpesaRoutes } from './routes/mpesa.js';
import { orderRoutes } from './routes/orders.js';
import { productRoutes } from './routes/products.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/mpesa', mpesaRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});