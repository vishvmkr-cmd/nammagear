import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';
import {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
  getListingContact,
} from '../services/listing.service.js';
import { Condition, ListingStatus } from '@prisma/client';

const router = Router();

const createListingSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  categoryId: z.string().min(1, 'Category is required'),
  condition: z.enum(['A', 'B', 'C']),
  price: z.number().int().positive('Price must be positive'),
  negotiable: z.boolean(),
  pincode: z.string().length(6, 'Pincode must be 6 digits'),
  ageYears: z.number().optional(),
  hasBill: z.boolean(),
  imageUrls: z.array(z.string().url()).min(1).max(5),
});

const updateListingSchema = z.object({
  title: z.string().min(5).optional(),
  description: z.string().min(20).optional(),
  price: z.number().int().positive().optional(),
  negotiable: z.boolean().optional(),
  condition: z.enum(['A', 'B', 'C']).optional(),
  status: z.enum(['ACTIVE', 'SOLD', 'REMOVED']).optional(),
});

router.post(
  '/',
  requireAdmin,
  validate(createListingSchema),
  async (req: Request, res: Response) => {
    try {
      const listing = await createListing({
        userId: req.user!.userId,
        ...req.body,
      });
      res.status(201).json(listing);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to create listing' });
      }
    }
  }
);

router.get('/', async (req: Request, res: Response) => {
  try {
    const filters = {
      category: req.query.category as string | undefined,
      pincode: req.query.pincode as string | undefined,
      condition: req.query.condition as Condition | undefined,
      minPrice: req.query.minPrice
        ? parseInt(req.query.minPrice as string)
        : undefined,
      maxPrice: req.query.maxPrice
        ? parseInt(req.query.maxPrice as string)
        : undefined,
      sort: req.query.sort as 'newest' | 'price_asc' | 'price_desc' | undefined,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    };

    const result = await getListings(filters);
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to fetch listings' });
    }
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
    const listing = await getListingById(id, true);
    res.json(listing);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to fetch listing' });
    }
  }
});

router.patch(
  '/:id',
  requireAuth,
  validate(updateListingSchema),
  async (req: Request, res: Response) => {
    try {
      const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
      const listing = await updateListing(
        id,
        req.user!.userId,
        req.body
      );
      res.json(listing);
    } catch (error) {
      if (error instanceof Error) {
        const status = error.message.includes('Unauthorized') ? 403 : 400;
        res.status(status).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to update listing' });
      }
    }
  }
);

router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
    const result = await deleteListing(id, req.user!.userId);
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      const status = error.message.includes('Unauthorized') ? 403 : 400;
      res.status(status).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to delete listing' });
    }
  }
});

router.get('/:id/contact', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
    const contact = await getListingContact(id);
    res.json(contact);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to get contact info' });
    }
  }
});

export default router;
