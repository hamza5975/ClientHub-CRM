import Lead, { ILead, LeadStage } from '../models/Lead';

interface LeadFilters {
  search?: string;
  stage?: LeadStage;
  assignedTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface CreateLeadInput {
  title: string;
  company: string;
  contactName: string;
  email: string;
  phone?: string;
  stage?: LeadStage;
  value?: number;
  assignedTo: string;
  notes?: string;
}

export async function getLeads(filters: LeadFilters): Promise<{ leads: ILead[]; total: number }> {
  const { search, stage, assignedTo, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 50 } = filters;
  
  const query: Record<string, unknown> = {};
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
      { contactName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  
  if (stage) query.stage = stage;
  if (assignedTo) query.assignedTo = assignedTo;

  const skip = (page - 1) * limit;
  
  const [leads, total] = await Promise.all([
    Lead.find(query)
      .populate('assignedTo', 'name email')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit),
    Lead.countDocuments(query),
  ]);

  return { leads, total };
}

export async function getLeadById(id: string): Promise<ILead | null> {
  return Lead.findById(id).populate('assignedTo', 'name email');
}

export async function createLead(input: CreateLeadInput): Promise<ILead> {
  return Lead.create(input);
}

export async function updateLead(id: string, input: Partial<CreateLeadInput>): Promise<ILead | null> {
  return Lead.findByIdAndUpdate(id, input, { new: true }).populate('assignedTo', 'name email');
}

export async function deleteLead(id: string): Promise<void> {
  await Lead.findByIdAndDelete(id);
}

export async function getLeadStats(): Promise<{
  total: number;
  byStage: Record<string, number>;
  totalValue: number;
}> {
  const leads = await Lead.find();
  const byStage: Record<string, number> = {};
  let totalValue = 0;

  for (const lead of leads) {
    byStage[lead.stage] = (byStage[lead.stage] || 0) + 1;
    totalValue += lead.value;
  }

  return { total: leads.length, byStage, totalValue };
}
