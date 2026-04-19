import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { requireAdmin } from '../middleware/admin.js';
import { prisma } from '../db.js';
import { getOrders, updateOrderStatus } from '../services/order.service.js';
import {
  getServiceTickets,
  getServiceTicketById,
  updateServiceTicket,
} from '../services/service-ticket.service.js';
import { OrderStatus, TicketStatus, TicketPriority, ListingStatus } from '@prisma/client';

const router = Router();

router.use(requireAdmin);

// ─── Dashboard stats ───────────────────────────────────────────────
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const [
      totalUsers,
      totalListings,
      activeListings,
      totalOrders,
      pendingOrders,
      openTickets,
      revenue,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.listing.count(),
      prisma.listing.count({ where: { status: ListingStatus.ACTIVE } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      prisma.serviceTicket.count({
        where: { status: { in: [TicketStatus.OPEN, TicketStatus.IN_PROGRESS] } },
      }),
      prisma.order.aggregate({
        _sum: { amount: true },
        where: { status: { in: [OrderStatus.CONFIRMED, OrderStatus.COMPLETED] } },
      }),
    ]);

    res.json({
      totalUsers,
      totalListings,
      activeListings,
      totalOrders,
      pendingOrders,
      openTickets,
      totalRevenue: revenue._sum.amount || 0,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// ─── Listings management ───────────────────────────────────────────
router.get('/listings', async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = Math.min(req.query.limit ? parseInt(req.query.limit as string) : 20, 50);
    const skip = (page - 1) * limit;
    const status = req.query.status as ListingStatus | undefined;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
        include: {
          images: { orderBy: { order: 'asc' }, take: 1 },
          category: true,
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.listing.count({ where }),
    ]);

    res.json({ items, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

const updateListingSchema = z.object({
  title: z.string().min(5).optional(),
  description: z.string().min(20).optional(),
  price: z.number().int().positive().optional(),
  negotiable: z.boolean().optional(),
  condition: z.enum(['A', 'B', 'C']).optional(),
  status: z.enum(['ACTIVE', 'SOLD', 'REMOVED']).optional(),
});

router.patch(
  '/listings/:id',
  validate(updateListingSchema),
  async (req: Request, res: Response) => {
    try {
      const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
      const listing = await prisma.listing.update({
        where: { id },
        data: req.body,
        include: {
          images: true,
          category: true,
          user: { select: { id: true, name: true, email: true } },
        },
      });
      res.json(listing);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to update listing' });
      }
    }
  }
);

router.delete('/listings/:id', async (req: Request, res: Response) => {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
    await prisma.listing.update({
      where: { id },
      data: { status: ListingStatus.REMOVED },
    });
    res.json({ message: 'Listing removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove listing' });
  }
});

// ─── Orders management ─────────────────────────────────────────────
router.get('/orders', async (req: Request, res: Response) => {
  try {
    const result = await getOrders({
      status: req.query.status as OrderStatus | undefined,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

const updateOrderSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']),
});

router.patch(
  '/orders/:id',
  validate(updateOrderSchema),
  async (req: Request, res: Response) => {
    try {
      const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
      const order = await updateOrderStatus(id, req.body.status);
      res.json(order);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to update order' });
      }
    }
  }
);

// ─── Service tickets management ────────────────────────────────────
router.get('/service-tickets', async (req: Request, res: Response) => {
  try {
    const result = await getServiceTickets({
      status: req.query.status as TicketStatus | undefined,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service tickets' });
  }
});

const updateTicketSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
  resolution: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
});

router.patch(
  '/service-tickets/:id',
  validate(updateTicketSchema),
  async (req: Request, res: Response) => {
    try {
      const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
      const ticket = await updateServiceTicket(id, req.body);
      res.json(ticket);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to update service ticket' });
      }
    }
  }
);

// ─── Users management ──────────────────────────────────────────────
router.get('/users', async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = Math.min(req.query.limit ? parseInt(req.query.limit as string) : 20, 50);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          college: true,
          pincode: true,
          area: true,
          rating: true,
          totalSales: true,
          verifiedAt: true,
          createdAt: true,
          _count: {
            select: { listings: true, orders: true },
          },
        },
      }),
      prisma.user.count(),
    ]);

    res.json({ items, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;
