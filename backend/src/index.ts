import express, { Express } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
// import bodyparser from 'body-parser'
// import helmet from 'helmet'
import { PORT } from './secret'

import rootRouter from './routes';
import { errorMiddleware } from './middlewares/errors';

const app: Express = express();

// Basic Express middleware for security.
// app.use(helmet())
// Middleware to parse request bodies.
// app.use(bodyparser.json())

app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
}));
app.use(express.json());

// Use the routes
app.use('/api', rootRouter)

export const prisma = new PrismaClient()
    .$extends({
        result: {
            address: {
                formattedAddress: {
                    needs: {
                        lineOne: true,
                        lineTwo: true,
                        city: true,
                        country: true,
                        pincode: true
                    },
                    compute: (addr) => {
                        return `${addr.lineOne}, ${addr.lineTwo}, ${addr.city}, ${addr.country}-${addr.pincode}`
                    }
                }
            }
        }
    })

app.use(errorMiddleware)

const port = PORT;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});