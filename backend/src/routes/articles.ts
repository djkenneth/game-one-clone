import { Router } from 'express';
import { prisma } from '../index'

const router = Router();

// Get all articles
router.get('/', async (req, res) => {
    const articles = await prisma.article.findMany({
        include: { author: true },
    });
    res.json(articles);
});

// Create a new article
router.post('/', async (req, res) => {
    const { title, body, authorId } = req.body;
    const article = await prisma.article.create({
        data: {
            title,
            body,
            author: { connect: { id: authorId } },
        },
    });
    res.json(article);
});

export default router;