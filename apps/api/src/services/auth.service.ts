import { prisma } from '../db.js';
import { hashPassword, verifyPassword } from '../lib/bcrypt.js';
import { signToken } from '../lib/jwt.js';
import { isBangalorePincode, PINCODE_TO_AREA } from '../lib/bangalore.js';

export interface SignupData {
  email: string;
  password: string;
  name: string;
  pincode: string;
  phone: string;
  college?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export async function signup(data: SignupData) {
  const email = data.email.trim().toLowerCase();
  const pincode = data.pincode.trim();
  const phone = data.phone.trim();
  const name = data.name.trim();
  const college = data.college?.trim() || undefined;

  if (!isBangalorePincode(pincode)) {
    throw new Error('Only Bangalore pincodes (560001-560103) are allowed');
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('Email already registered');
  }

  const passwordHash = await hashPassword(data.password);
  const area = PINCODE_TO_AREA[pincode] || 'Bangalore';

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      pincode,
      area,
      phone,
      college,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
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

  const token = signToken({ userId: user.id, email: user.email, role: user.role });

  return { user, token };
}

export async function login(data: LoginData) {
  const email = data.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.passwordHash) {
    throw new Error('This account uses Google sign-in. Use Continue with Google.');
  }

  const isValid = await verifyPassword(data.password, user.passwordHash);

  if (!isValid) {
    throw new Error('Invalid email or password');
  }

  const token = signToken({ userId: user.id, email: user.email, role: user.role });

  const { passwordHash: _ph, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
}

const DEFAULT_OAUTH_PINCODE = '560001';

export async function loginOrSignupWithGoogle(profile: {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
}) {
  const email = profile.email.trim().toLowerCase();
  const name =
    profile.name.trim().slice(0, 50) ||
    email.split('@')[0] ||
    'User';

  const byGoogle = await prisma.user.findUnique({
    where: { googleId: profile.googleId },
  });

  if (byGoogle) {
    const token = signToken({
      userId: byGoogle.id,
      email: byGoogle.email,
      role: byGoogle.role,
    });
    const { passwordHash: _p, ...user } = byGoogle;
    return { user, token };
  }

  const byEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (byEmail) {
    if (byEmail.googleId && byEmail.googleId !== profile.googleId) {
      throw new Error('This email is linked to a different Google account');
    }

    const updated = await prisma.user.update({
      where: { id: byEmail.id },
      data: {
        googleId: profile.googleId,
        ...(profile.picture && !byEmail.avatarUrl
          ? { avatarUrl: profile.picture }
          : {}),
      },
    });

    const token = signToken({
      userId: updated.id,
      email: updated.email,
      role: updated.role,
    });
    const { passwordHash: _p, ...user } = updated;
    return { user, token };
  }

  const area =
    PINCODE_TO_AREA[DEFAULT_OAUTH_PINCODE] || 'Bangalore';

  const user = await prisma.user.create({
    data: {
      email,
      name,
      googleId: profile.googleId,
      passwordHash: null,
      pincode: DEFAULT_OAUTH_PINCODE,
      area,
      avatarUrl: profile.picture || undefined,
    },
  });

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });
  const { passwordHash: _p, ...safe } = user;
  return { user: safe, token };
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
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
