import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export function generateToken(userId: string): string {
  const secret = process.env.JWT_SECRET || 'fallback-secret';
  return jwt.sign({ id: userId }, secret, { expiresIn: '7d' });
}

export async function login(input: LoginInput): Promise<{ user: IUser; token: string }> {
  const user = await User.findOne({ email: input.email.toLowerCase() });
  if (!user) {
    throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
  }

  const isMatch = await bcrypt.compare(input.password, user.password);
  if (!isMatch) {
    throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
  }

  const token = generateToken(user._id.toString());
  return { user, token };
}

export async function register(input: RegisterInput): Promise<{ user: IUser; token: string }> {
  const existing = await User.findOne({ email: input.email.toLowerCase() });
  if (existing) {
    throw Object.assign(new Error('Email already registered'), { statusCode: 400 });
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);
  const user = await User.create({
    name: input.name,
    email: input.email.toLowerCase(),
    password: hashedPassword,
    role: input.role || 'SalesRep',
  });

  const token = generateToken(user._id.toString());
  return { user, token };
}

export async function getUserById(id: string): Promise<IUser | null> {
  return User.findById(id).select('-password');
}

export async function getAllUsers(): Promise<IUser[]> {
  return User.find().select('-password').sort({ createdAt: -1 });
}

export async function updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
  if (data.password) {
    data.password = await bcrypt.hash(data.password as string, 10);
  }
  return User.findByIdAndUpdate(id, data, { new: true }).select('-password');
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
  const user = await User.findById(userId);
  if (!user) {
    throw Object.assign(new Error('User not found'), { statusCode: 404 });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw Object.assign(new Error('Current password is incorrect'), { statusCode: 400 });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
}
