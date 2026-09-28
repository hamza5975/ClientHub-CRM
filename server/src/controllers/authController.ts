import type { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw Object.assign(new Error('Email and password are required'), { statusCode: 400 });
    }
    const result = await authService.login({ email, password });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      throw Object.assign(new Error('Name, email, and password are required'), { statusCode: 400 });
    }
    const result = await authService.register({ name, email, password, role });
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = (req as Request & { userId?: string }).userId;
    if (!userId) {
      throw Object.assign(new Error('Not authenticated'), { statusCode: 401 });
    }
    const user = await authService.getUserById(userId);
    if (!user) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = (req as Request & { userId?: string }).userId;
    if (!userId) {
      throw Object.assign(new Error('Not authenticated'), { statusCode: 401 });
    }
    const { name, avatar } = req.body;
    const user = await authService.updateUser(userId, { name, avatar });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = (req as Request & { userId?: string }).userId;
    if (!userId) {
      throw Object.assign(new Error('Not authenticated'), { statusCode: 401 });
    }
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throw Object.assign(new Error('Current and new passwords are required'), { statusCode: 400 });
    }
    await authService.changePassword(userId, currentPassword, newPassword);
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
}

export async function getAllUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const users = await authService.getAllUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
}
