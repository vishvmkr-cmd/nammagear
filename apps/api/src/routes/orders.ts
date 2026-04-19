import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import {
  createOrder,
  getOrders,
  getOrderById,
} from '../services/order.service.js';

const router = Router();

const createOrderSchema = z.object({
  listingId: z.string().min(1, 'Listing ID is required'),
  notes: z.string().optional(),
});

router.post(
  '/',
  requireAuth,
  validate(createOrderSchema),
  async (req: Request, res: Response) => {
    try {
      const order = await createOrder({
        buyerId: req.user!.userId,
        ...req.body,
      });
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to create order' });
      }
    }
  }
);

router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const result = await getOrders({
      buyerId: req.user!.userId,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
    const order = await getOrderById(id);

    if (order.buyerId !== req.user!.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(order);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  }
});

export default router;
