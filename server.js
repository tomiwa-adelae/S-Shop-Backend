import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './config/mongDb.js';

// Import Routes
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';

dotenv.config();

const app = express();

// Cross origin requests
app.use(cors());

// Express body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
connectDb();

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}...`));
