import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import {
  createServiceTicket,
  getServiceTickets,
  getServiceTicketById,
} from '../services/service-ticket.service.js';

const router = Router();

const createTicketSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
});

router.post(
  '/',
  requireAuth,
  validate(createTicketSchema),
  async (req: Request, res: Response) => {
    try {
      const ticket = await createServiceTicket({
        userId: req.user!.userId,
        ...req.body,
      });
      res.status(201).json(ticket);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to create service ticket' });
      }
    }
  }
);

router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const result = await getServiceTickets({
      userId: req.user!.userId,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service tickets' });
  }
});

router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
    const ticket = await getServiceTicketById(id);

    if (ticket.userId !== req.user!.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(ticket);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to fetch service ticket' });
    }
  }
});

export default router;
