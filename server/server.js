import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { mpesaRoutes } from './routes/mpesa.js';
import { orderRoutes } from './routes/orders.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/mpesa', mpesaRoutes);
app.use('/api/orders', orderRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});