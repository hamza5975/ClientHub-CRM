import type { Request, Response, NextFunction } from 'express';
import * as leadService from '../services/leadService';

export async function getLeads(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { search, stage, assignedTo, sortBy, sortOrder, page, limit } = req.query;
    const result = await leadService.getLeads({
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

export async function getLeadById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const lead = await leadService.getLeadById(req.params.id);
    if (!lead) {
      throw Object.assign(new Error('Lead not found'), { statusCode: 404 });
    }
    res.json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
}

export async function createLead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = (req as Request & { userId?: string }).userId;
    const lead = await leadService.createLead({ ...req.body, assignedTo: req.body.assignedTo || userId });
    res.status(201).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
}

export async function updateLead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const lead = await leadService.updateLead(req.params.id, req.body);
    if (!lead) {
      throw Object.assign(new Error('Lead not found'), { statusCode: 404 });
    }
    res.json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
}

export async function deleteLead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await leadService.deleteLead(req.params.id);
    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (err) {
    next(err);
  }
}

export async function getLeadStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const stats = await leadService.getLeadStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}
