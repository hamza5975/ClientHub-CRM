import type { Request, Response, NextFunction } from 'express';
import * as companyService from '../services/companyService';

export async function getCompanies(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { search, industry, sortBy, sortOrder, page, limit } = req.query;
    const result = await companyService.getCompanies({
      search: search as string,
      industry: industry as string,
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

export async function getCompanyById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const company = await companyService.getCompanyById(req.params.id);
    if (!company) {
      throw Object.assign(new Error('Company not found'), { statusCode: 404 });
    }
    res.json({ success: true, data: company });
  } catch (err) {
    next(err);
  }
}

export async function createCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const company = await companyService.createCompany(req.body);
    res.status(201).json({ success: true, data: company });
  } catch (err) {
    next(err);
  }
}

export async function updateCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const company = await companyService.updateCompany(req.params.id, req.body);
    if (!company) {
      throw Object.assign(new Error('Company not found'), { statusCode: 404 });
    }
    res.json({ success: true, data: company });
  } catch (err) {
    next(err);
  }
}

export async function deleteCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await companyService.deleteCompany(req.params.id);
    res.json({ success: true, message: 'Company deleted successfully' });
  } catch (err) {
    next(err);
  }
}
