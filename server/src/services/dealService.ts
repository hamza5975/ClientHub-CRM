import Deal, { IDeal, DealStage } from '../models/Deal';

interface DealFilters {
  search?: string;
  stage?: DealStage;
  assignedTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface CreateDealInput {
  title: string;
  company: string;
  contact?: string;
  value?: number;
  stage?: DealStage;
  probability?: number;
  expectedCloseDate?: Date;
  assignedTo: string;
}

export async function getDeals(filters: DealFilters): Promise<{ deals: IDeal[]; total: number }> {
  const { search, stage, assignedTo, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 50 } = filters;
  
  const query: Record<string, unknown> = {};
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
    ];
  }
  
  if (stage) query.stage = stage;
  if (assignedTo) query.assignedTo = assignedTo;

  const skip = (page - 1) * limit;
  
  const [deals, total] = await Promise.all([
    Deal.find(query)
      .populate('assignedTo', 'name email')
      .populate('contact', 'firstName lastName email')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit),
    Deal.countDocuments(query),
  ]);

  return { deals, total };
}

export async function getDealById(id: string): Promise<IDeal | null> {
  return Deal.findById(id)
    .populate('assignedTo', 'name email')
    .populate('contact', 'firstName lastName email');
}

export async function createDeal(input: CreateDealInput): Promise<IDeal> {
  return Deal.create(input);
}

export async function updateDeal(id: string, input: Partial<CreateDealInput>): Promise<IDeal | null> {
  return Deal.findByIdAndUpdate(id, input, { new: true })
    .populate('assignedTo', 'name email')
    .populate('contact', 'firstName lastName email');
}

export async function deleteDeal(id: string): Promise<void> {
  await Deal.findByIdAndDelete(id);
}

export async function getDealStats(): Promise<{
  total: number;
  byStage: Record<string, number>;
  totalValue: number;
  wonValue: number;
}> {
  const deals = await Deal.find();
  const byStage: Record<string, number> = {};
  let totalValue = 0;
  let wonValue = 0;

  for (const deal of deals) {
    byStage[deal.stage] = (byStage[deal.stage] || 0) + 1;
    totalValue += deal.value;
    if (deal.stage === 'Won') wonValue += deal.value;
  }

  return { total: deals.length, byStage, totalValue, wonValue };
}
