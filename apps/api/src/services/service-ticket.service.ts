import { prisma } from '../db.js';
import { TicketStatus, TicketPriority } from '@prisma/client';

export interface CreateTicketData {
  orderId: string;
  userId: string;
  subject: string;
  description: string;
  priority?: TicketPriority;
}

export interface TicketFilters {
  userId?: string;
  orderId?: string;
  status?: TicketStatus;
  page?: number;
  limit?: number;
}

export async function createServiceTicket(data: CreateTicketData) {
  const order = await prisma.order.findUnique({
    where: { id: data.orderId },
    select: { buyerId: true, serviceExpiresAt: true, status: true },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  if (order.buyerId !== data.userId) {
    throw new Error('Unauthorized: You can only create tickets for your own orders');
  }

  if (order.status === 'CANCELLED') {
    throw new Error('Cannot create service ticket for a cancelled order');
  }

  if (new Date() > order.serviceExpiresAt) {
    throw new Error('Service support has expired for this order. Your 1-year coverage ended on ' +
      order.serviceExpiresAt.toLocaleDateString('en-IN'));
  }

  return prisma.serviceTicket.create({
    data: {
      orderId: data.orderId,
      userId: data.userId,
      subject: data.subject,
      description: data.description,
      priority: data.priority || TicketPriority.MEDIUM,
    },
    include: {
      order: {
        include: {
          listing: { select: { id: true, title: true } },
        },
      },
    },
  });
}

export async function getServiceTickets(filters: TicketFilters) {
  const { userId, orderId, status, page = 1, limit = 20 } = filters;
  const take = Math.min(limit, 50);
  const skip = (page - 1) * take;

  const where: Record<string, unknown> = {};
  if (userId) where.userId = userId;
  if (orderId) where.orderId = orderId;
  if (status) where.status = status;

  const [items, total] = await Promise.all([
    prisma.serviceTicket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take,
      skip,
      include: {
        order: {
          include: {
            listing: {
              select: { id: true, title: true },
              },
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.serviceTicket.count({ where }),
  ]);

  return { items, total, page, totalPages: Math.ceil(total / take) };
}

export async function getServiceTicketById(id: string) {
  const ticket = await prisma.serviceTicket.findUnique({
    where: { id },
    include: {
      order: {
        include: {
          listing: {
            include: {
              images: { orderBy: { order: 'asc' }, take: 1 },
              category: true,
            },
          },
          buyer: { select: { id: true, name: true, email: true, phone: true } },
        },
      },
      user: {
        select: { id: true, name: true, email: true, phone: true },
      },
    },
  });

  if (!ticket) {
    throw new Error('Service ticket not found');
  }

  return ticket;
}

export async function updateServiceTicket(
  id: string,
  data: { status?: TicketStatus; resolution?: string; priority?: TicketPriority }
) {
  const ticket = await prisma.serviceTicket.findUnique({ where: { id } });
  if (!ticket) {
    throw new Error('Service ticket not found');
  }

  return prisma.serviceTicket.update({
    where: { id },
    data: {
      ...(data.status && { status: data.status }),
      ...(data.resolution !== undefined && { resolution: data.resolution }),
      ...(data.priority && { priority: data.priority }),
    },
    include: {
      order: {
        include: {
          listing: { select: { id: true, title: true } },
        },
      },
      user: { select: { id: true, name: true, email: true } },
    },
  });
}
