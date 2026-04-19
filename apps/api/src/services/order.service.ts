import { prisma } from '../db.js';
import { OrderStatus, ListingStatus } from '@prisma/client';

export interface CreateOrderData {
  buyerId: string;
  listingId: string;
  notes?: string;
}

export interface OrderFilters {
  buyerId?: string;
  status?: OrderStatus;
  page?: number;
  limit?: number;
}

export async function createOrder(data: CreateOrderData) {
  const listing = await prisma.listing.findUnique({
    where: { id: data.listingId },
    include: { user: { select: { id: true } } },
  });

  if (!listing) {
    throw new Error('Listing not found');
  }

  if (listing.status !== ListingStatus.ACTIVE) {
    throw new Error('Listing is no longer available');
  }

  if (listing.userId === data.buyerId) {
    throw new Error('You cannot buy your own listing');
  }

  const serviceExpiresAt = new Date();
  serviceExpiresAt.setFullYear(serviceExpiresAt.getFullYear() + 1);

  const [order] = await prisma.$transaction([
    prisma.order.create({
      data: {
        buyerId: data.buyerId,
        listingId: data.listingId,
        amount: listing.price,
        notes: data.notes,
        serviceExpiresAt,
      },
      include: {
        listing: {
          include: {
            images: { orderBy: { order: 'asc' }, take: 1 },
            category: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    }),
    prisma.listing.update({
      where: { id: data.listingId },
      data: { status: ListingStatus.SOLD },
    }),
    prisma.user.update({
      where: { id: listing.userId },
      data: { totalSales: { increment: 1 } },
    }),
  ]);

  return order;
}

export async function getOrders(filters: OrderFilters) {
  const { buyerId, status, page = 1, limit = 20 } = filters;
  const take = Math.min(limit, 50);
  const skip = (page - 1) * take;

  const where: Record<string, unknown> = {};
  if (buyerId) where.buyerId = buyerId;
  if (status) where.status = status;

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take,
      skip,
      include: {
        listing: {
          include: {
            images: { orderBy: { order: 'asc' }, take: 1 },
            category: true,
            user: { select: { id: true, name: true } },
          },
        },
        buyer: {
          select: { id: true, name: true, email: true },
        },
        _count: { select: { serviceTickets: true } },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return { items, total, page, totalPages: Math.ceil(total / take) };
}

export async function getOrderById(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      listing: {
        include: {
          images: { orderBy: { order: 'asc' } },
          category: true,
          user: { select: { id: true, name: true, phone: true, college: true } },
        },
      },
      buyer: {
        select: { id: true, name: true, email: true, phone: true },
      },
      serviceTickets: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  return order;
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    throw new Error('Order not found');
  }

  return prisma.order.update({
    where: { id },
    data: { status },
    include: {
      listing: { include: { category: true } },
      buyer: { select: { id: true, name: true, email: true } },
    },
  });
}
