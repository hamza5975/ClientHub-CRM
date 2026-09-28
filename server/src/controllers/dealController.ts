import type { Request, Response, NextFunction } from 'express';
import * as dealService from '../services/dealService';

export async function getDeals(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { search, stage, assignedTo, sortBy, sortOrder, page, limit } = req.query;
    const result = await dealService.getDeals({
      search: search as string,
      stage: stage as string | undefined,
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

export async function getDealById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const deal = await dealService.getDealById(req.params.id);
    if (!deal) {
      throw Object.assign(new Error('Deal not found'), { statusCode: 404 });
    }
    res.json({ success: true, data: deal });
  } catch (err) {
    next(err);
  }
}

export async function createDeal(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = (req as Request & { userId?: string }).userId;
    const deal = await dealService.createDeal({ ...req.body, assignedTo: req.body.assignedTo || userId });
    res.status(201).json({ success: true, data: deal });
  } catch (err) {
    next(err);
  }
}

export async function updateDeal(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const deal = await dealService.updateDeal(req.params.id, req.body);
    if (!deal) {
      throw Object.assign(new Error('Deal not found'), { statusCode: 404 });
    }
    res.json({ success: true, data: deal });
  } catch (err) {
    next(err);
  }
}

export async function deleteDeal(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await dealService.deleteDeal(req.params.id);
    res.json({ success: true, message: 'Deal deleted successfully' });
  } catch (err) {
    next(err);
  }
}

export async function getDealStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const stats = await dealService.getDealStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}
