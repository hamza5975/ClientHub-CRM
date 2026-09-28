import type { Request, Response, NextFunction } from 'express';
import * as taskService from '../services/taskService';

export async function getTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { search, status, priority, assignedTo, sortBy, sortOrder, page, limit } = req.query;
    const result = await taskService.getTasks({
      search: search as string,
      status: status as string | undefined,
      priority: priority as string | undefined,
      assignedTo: assignedTo as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const task = await taskService.getTaskById(req.params.id);
    if (!task) {
      throw Object.assign(new Error('Task not found'), { statusCode: 404 });
    }
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

export async function createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = (req as Request & { userId?: string }).userId;
    const task = await taskService.createTask({ ...req.body, assignedTo: req.body.assignedTo || userId });
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const task = await taskService.updateTask(req.params.id, req.body);
    if (!task) {
      throw Object.assign(new Error('Task not found'), { statusCode: 404 });
    }
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await taskService.deleteTask(req.params.id);
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
}

export async function getTaskStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const stats = await taskService.getTaskStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}
