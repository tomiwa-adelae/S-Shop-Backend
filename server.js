import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Cross origin requests
app.use(cors());

// Express body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
   .connect(process.env.MONGO_URI)
   .then((conn) =>
      console.log(`MongoDB connected with :${conn.connection.host}`)
   )
   .catch((err) => console.log(`An error occured...`));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}...`));
