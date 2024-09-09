import express from 'express';
import cors from 'cors';
import bodyparser from 'body-parser'
import helmet from 'helmet'

// import userRoutes from './routes/users';
// import articleRoutes from './routes/articles';
import productRoutes from './routes/products';

const app = express();

// Basic Express middleware for security.
app.use(helmet())
// Middleware to parse request bodies.
app.use(bodyparser.json())

app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
}));
app.use(express.json());

// Use the routes
// app.use('/users', userRoutes);
// app.use('/articles', articleRoutes);
app.use('/products', productRoutes);

const port = 3001;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});