import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all users
router.get('/', async (req, res) => {
    const users = await prisma.user.findMany({
        include: { articles: true },
    });
    res.json(users);
});

// Create a new user
router.post('/', async (req, res) => {
    const { email, name } = req.body;
    const user = await prisma.user.create({
        data: { email, name },
    });
    res.json(user);
});

export default router;