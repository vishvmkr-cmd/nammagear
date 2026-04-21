import { prisma } from '../db.js';
import { ListingStatus, OrderStatus, Prisma } from '@prisma/client';

const listingInclude = {
  images: { orderBy: { order: 'asc' as const }, take: 1 },
  category: { select: { id: true, name: true, slug: true } },
  user: { select: { id: true, name: true } },
} as const;

/** Remove cart rows for listings that are no longer buyable. */
async function pruneInvalidCartItems(userId: string) {
  await prisma.cartItem.deleteMany({
    where: {
      userId,
      OR: [
        { listing: { status: { not: ListingStatus.ACTIVE } } },
        { listing: { userId } },
      ],
    },
  });
}

export async function getCart(userId: string) {
  await pruneInvalidCartItems(userId);

  const items = await prisma.cartItem.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      listing: {
        include: listingInclude,
      },
    },
  });

  return { items };
}

export async function addToCart(userId: string, listingId: string) {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { id: true, status: true, userId: true },
  });

  if (!listing) {
    throw new Error('Listing not found');
  }
  if (listing.status !== ListingStatus.ACTIVE) {
    throw new Error('Listing is no longer available');
  }
  if (listing.userId === userId) {
    throw new Error('You cannot add your own listing to the cart');
  }

  try {
    await prisma.cartItem.create({
      data: { userId, listingId },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      throw new Error('Already in cart');
    }
    throw e;
  }

  await pruneInvalidCartItems(userId);

  return getCart(userId);
}

export async function removeFromCart(userId: string, listingId: string) {
  await prisma.cartItem.deleteMany({
    where: { userId, listingId },
  });
  return getCart(userId);
}

/** Create one order per cart line (same behaviour as former “Buy now” each), then clear cart. */
export async function checkoutCart(userId: string) {
  await pruneInvalidCartItems(userId);

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      listing: {
        include: { user: { select: { id: true } } },
      },
    },
  });

  if (cartItems.length === 0) {
    throw new Error('Cart is empty');
  }

  const orders = await prisma.$transaction(async (tx) => {
    const created: Awaited<ReturnType<typeof tx.order.create>>[] = [];

    for (const row of cartItems) {
      const listing = row.listing;
      if (listing.status !== ListingStatus.ACTIVE || listing.userId === userId) {
        continue;
      }

      const serviceExpiresAt = new Date();
      serviceExpiresAt.setFullYear(serviceExpiresAt.getFullYear() + 1);

      const order = await tx.order.create({
        data: {
          buyerId: userId,
          listingId: listing.id,
          amount: listing.price,
          status: OrderStatus.PENDING,
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
            select: { id: true, name: true, email: true, phone: true },
          },
        },
      });

      await tx.listing.update({
        where: { id: listing.id },
        data: { status: ListingStatus.SOLD },
      });

      await tx.user.update({
        where: { id: listing.userId },
        data: { totalSales: { increment: 1 } },
      });

      created.push(order);
    }

    if (created.length === 0) {
      throw new Error('No items could be checked out');
    }

    await tx.cartItem.deleteMany({ where: { userId } });

    return created;
  });

  return { orders };
}
