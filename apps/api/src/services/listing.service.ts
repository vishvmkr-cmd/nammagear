import { prisma } from '../db.js';
import { isBangalorePincode, PINCODE_TO_AREA } from '../lib/bangalore.js';
import { Condition, ListingStatus } from '@prisma/client';

export interface CreateListingData {
  userId: string;
  title: string;
  description: string;
  categoryId: string;
  condition: Condition;
  price: number;
  negotiable: boolean;
  pincode: string;
  ageYears?: number;
  hasBill: boolean;
  imageUrls: string[];
}

export interface UpdateListingData {
  title?: string;
  description?: string;
  price?: number;
  negotiable?: boolean;
  condition?: Condition;
  status?: ListingStatus;
}

export interface ListingFilters {
  category?: string;
  pincode?: string;
  condition?: Condition;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
}

export async function createListing(data: CreateListingData) {
  if (!isBangalorePincode(data.pincode)) {
    throw new Error('Only Bangalore pincodes (560001-560103) are allowed');
  }

  if (data.imageUrls.length === 0) {
    throw new Error('At least one image is required');
  }

  if (data.imageUrls.length > 5) {
    throw new Error('Maximum 5 images allowed');
  }

  const area = PINCODE_TO_AREA[data.pincode] || 'Bangalore';

  const listing = await prisma.listing.create({
    data: {
      userId: data.userId,
      title: data.title,
      description: data.description,
      categoryId: data.categoryId,
      condition: data.condition,
      price: data.price,
      negotiable: data.negotiable,
      pincode: data.pincode,
      area,
      ageYears: data.ageYears,
      hasBill: data.hasBill,
      images: {
        create: data.imageUrls.map((url, index) => ({
          url,
          order: index,
        })),
      },
    },
    include: {
      images: true,
      category: true,
      user: {
        select: {
          id: true,
          name: true,
          college: true,
          rating: true,
          totalSales: true,
          verifiedAt: true,
        },
      },
    },
  });

  return listing;
}

export async function getListings(filters: ListingFilters) {
  const {
    category,
    pincode,
    condition,
    minPrice,
    maxPrice,
    sort = 'newest',
    page = 1,
    limit = 20,
  } = filters;

  const take = Math.min(limit, 50);
  const skip = (page - 1) * take;

  const where: any = {
    status: ListingStatus.ACTIVE,
  };

  if (category) {
    const cat = await prisma.category.findUnique({
      where: { slug: category },
    });
    if (cat) {
      where.categoryId = cat.id;
    }
  }

  if (pincode) {
    where.pincode = pincode;
  }

  if (condition) {
    where.condition = condition;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) {
      where.price.gte = minPrice;
    }
    if (maxPrice !== undefined) {
      where.price.lte = maxPrice;
    }
  }

  const orderBy: any = {};
  if (sort === 'newest') {
    orderBy.createdAt = 'desc';
  } else if (sort === 'price_asc') {
    orderBy.price = 'asc';
  } else if (sort === 'price_desc') {
    orderBy.price = 'desc';
  }

  const [items, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy,
      take,
      skip,
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
        category: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.listing.count({ where }),
  ]);

  const totalPages = Math.ceil(total / take);

  return {
    items,
    total,
    page,
    totalPages,
  };
}

export async function getListingById(id: string, incrementView = false) {
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
      category: true,
      user: {
        select: {
          id: true,
          name: true,
          college: true,
          rating: true,
          totalSales: true,
          verifiedAt: true,
        },
      },
    },
  });

  if (!listing) {
    throw new Error('Listing not found');
  }

  if (incrementView && listing.status === ListingStatus.ACTIVE) {
    await prisma.listing.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }

  return listing;
}

export async function updateListing(
  id: string,
  userId: string,
  data: UpdateListingData
) {
  const listing = await prisma.listing.findUnique({
    where: { id },
  });

  if (!listing) {
    throw new Error('Listing not found');
  }

  if (listing.userId !== userId) {
    throw new Error('Unauthorized: You can only edit your own listings');
  }

  const updated = await prisma.listing.update({
    where: { id },
    data,
    include: {
      images: true,
      category: true,
      user: {
        select: {
          id: true,
          name: true,
          college: true,
          rating: true,
          totalSales: true,
          verifiedAt: true,
        },
      },
    },
  });

  return updated;
}

export async function deleteListing(id: string, userId: string) {
  const listing = await prisma.listing.findUnique({
    where: { id },
  });

  if (!listing) {
    throw new Error('Listing not found');
  }

  if (listing.userId !== userId) {
    throw new Error('Unauthorized: You can only delete your own listings');
  }

  await prisma.listing.update({
    where: { id },
    data: { status: ListingStatus.REMOVED },
  });

  return { message: 'Listing removed successfully' };
}

export async function getListingContact(id: string) {
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          phone: true,
        },
      },
    },
  });

  if (!listing) {
    throw new Error('Listing not found');
  }

  if (!listing.user.phone) {
    throw new Error('Seller has not provided a phone number');
  }

  const phone = listing.user.phone;
  const message = encodeURIComponent(
    `Hi, I saw your ${listing.title} on NammaGear. Is it still available?`
  );
  const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${message}`;

  return { phone, whatsappUrl };
}
