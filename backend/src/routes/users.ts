import { Router } from 'express';
import { prisma } from '../index'

const router = Router();

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