import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import {
  getCart,
  addToCart,
  removeFromCart,
  checkoutCart,
} from '../services/cart.service.js';

const router = Router();

const addSchema = z.object({
  listingId: z.string().min(1, 'Listing ID is required'),
});

router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const cart = await getCart(req.user!.userId);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

router.post(
  '/',
  requireAuth,
  validate(addSchema),
  async (req: Request, res: Response) => {
    try {
      const cart = await addToCart(req.user!.userId, req.body.listingId);
      res.status(201).json(cart);
    } catch (error) {
      if (error instanceof Error) {
        const msg = error.message;
        const code =
          msg === 'Already in cart'
            ? 409
            : msg === 'You cannot add your own listing to the cart'
              ? 400
              : msg === 'Listing is no longer available' || msg === 'Listing not found'
                ? 400
                : 400;
        return res.status(code).json({ error: msg });
      }
      res.status(500).json({ error: 'Failed to add to cart' });
    }
  }
);

router.delete('/:listingId', requireAuth, async (req: Request, res: Response) => {
  try {
    const listingId =
      typeof req.params.listingId === 'string'
        ? req.params.listingId
        : req.params.listingId[0];
    const cart = await removeFromCart(req.user!.userId, listingId);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
});

router.post('/checkout', requireAuth, async (req: Request, res: Response) => {
  try {
    const result = await checkoutCart(req.user!.userId);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Checkout failed' });
  }
});

export default router;
