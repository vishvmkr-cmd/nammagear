import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { prisma } from '../db.js';

const router = Router();

router.get('/me/listings', requireAuth, async (req: Request, res: Response) => {
  try {
    const listings = await prisma.listing.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        images: { orderBy: { order: 'asc' }, take: 1 },
        category: true,
      },
    });
    res.json({ listings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch your listings' });
  }
});

router.patch('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const { name, phone, college } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(college !== undefined && { college }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        college: true,
        pincode: true,
        area: true,
        rating: true,
        totalSales: true,
        verifiedAt: true,
        createdAt: true,
      },
    });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
