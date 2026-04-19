import { prisma } from '../db.js';
import { hashPassword, verifyPassword } from '../lib/bcrypt.js';
import { signToken } from '../lib/jwt.js';
import { isBangalorePincode, PINCODE_TO_AREA } from '../lib/bangalore.js';

export interface SignupData {
  email: string;
  password: string;
  name: string;
  pincode: string;
  phone?: string;
  college?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export async function signup(data: SignupData) {
  if (!isBangalorePincode(data.pincode)) {
    throw new Error('Only Bangalore pincodes (560001-560103) are allowed');
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error('Email already registered');
  }

  const passwordHash = await hashPassword(data.password);
  const area = PINCODE_TO_AREA[data.pincode] || 'Bangalore';

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      name: data.name,
      pincode: data.pincode,
      area,
      phone: data.phone,
      college: data.college,
    },
    select: {
      id: true,
      email: true,
      name: true,
      pincode: true,
      area: true,
      phone: true,
      college: true,
      avatarUrl: true,
      rating: true,
      totalSales: true,
      verifiedAt: true,
      createdAt: true,
    },
  });

  const token = signToken({ userId: user.id, email: user.email });

  return { user, token };
}

export async function login(data: LoginData) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isValid = await verifyPassword(data.password, user.passwordHash);

  if (!isValid) {
    throw new Error('Invalid email or password');
  }

  const token = signToken({ userId: user.id, email: user.email });

  const { passwordHash, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      pincode: true,
      area: true,
      phone: true,
      college: true,
      avatarUrl: true,
      rating: true,
      totalSales: true,
      verifiedAt: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}
