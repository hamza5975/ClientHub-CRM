import Company, { ICompany } from '../models/Company';

interface CompanyFilters {
  search?: string;
  industry?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface CreateCompanyInput {
  name: string;
  industry?: string;
  size?: string;
  website?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export async function getCompanies(filters: CompanyFilters): Promise<{ companies: ICompany[]; total: number }> {
  const { search, industry, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 50 } = filters;
  
  const query: Record<string, unknown> = {};
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { industry: { $regex: search, $options: 'i' } },
    ];
  }
  
  if (industry) query.industry = { $regex: industry, $options: 'i' };

  const skip = (page - 1) * limit;
  
  const [companies, total] = await Promise.all([
    Company.find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit),
    Company.countDocuments(query),
  ]);

  return { companies, total };
}

export async function getCompanyById(id: string): Promise<ICompany | null> {
  return Company.findById(id);
}

export async function createCompany(input: CreateCompanyInput): Promise<ICompany> {
  return Company.create(input);
}

export async function updateCompany(id: string, input: Partial<CreateCompanyInput>): Promise<ICompany | null> {
  return Company.findByIdAndUpdate(id, input, { new: true });
}

export async function deleteCompany(id: string): Promise<void> {
  await Company.findByIdAndDelete(id);
}
