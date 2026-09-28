import type { Request, Response, NextFunction } from 'express';
import * as contactService from '../services/contactService';

export async function getContacts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { search, company, sortBy, sortOrder, page, limit } = req.query;
    const result = await contactService.getContacts({
      search: search as string,
      company: company as string,
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

export async function getContactById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const contact = await contactService.getContactById(req.params.id);
    if (!contact) {
      throw Object.assign(new Error('Contact not found'), { statusCode: 404 });
    }
    res.json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
}

export async function createContact(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = (req as Request & { userId?: string }).userId;
    const contact = await contactService.createContact({ ...req.body, createdBy: userId });
    res.status(201).json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
}

export async function updateContact(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const contact = await contactService.updateContact(req.params.id, req.body);
    if (!contact) {
      throw Object.assign(new Error('Contact not found'), { statusCode: 404 });
    }
    res.json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
}

export async function deleteContact(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await contactService.deleteContact(req.params.id);
    res.json({ success: true, message: 'Contact deleted successfully' });
  } catch (err) {
    next(err);
  }
}
