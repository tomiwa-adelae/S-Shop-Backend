import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDb from './config/mongDb.js';

// Import Routes
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import passwordResetRoutes from './routes/passwordResetRoutes.js';

const app = express();

// Express body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Cross origin requests
app.use(cors());

// MongoDB Connection
connectDb();

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/password-reset', passwordResetRoutes);

app.get('/', (req, res) => {
   res.send('APP IS RUNNING');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}...`));
