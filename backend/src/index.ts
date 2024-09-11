import express, { Express } from 'express';
import cors from 'cors';
import bodyparser from 'body-parser'
import helmet from 'helmet'
import { PORT } from './secret'

import rootRouter from './routes';

const app: Express = express();

// Basic Express middleware for security.
app.use(helmet())
// Middleware to parse request bodies.
app.use(bodyparser.json())

app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
}));
app.use(express.json());

// Use the routes
app.use('/api', rootRouter)

const port = PORT;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});