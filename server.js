import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './config/mongDb.js';

// Import Routes
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import userSellerRoutes from './routes/userSellerRoutes.js';
import authSellerRoutes from './routes/authSellerRoutes.js';
import sellerProductRoutes from './routes/sellerProductRoutes.js';
import sellerOrderRoutes from './routes/sellerOrderRoutes.js';



dotenv.config();

const app = express();

// Cross origin requests
app.use(cors());

// Express body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
connectDb();

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/uploads', uploadRoutes);

// Seller routes
app.use('/api/users/sellers', userSellerRoutes);
app.use('/api/auth/sellers', authSellerRoutes);
app.use('/api/seller/products', sellerProductRoutes);
app.use('/api/sellers/orders', sellerOrderRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}...`));
