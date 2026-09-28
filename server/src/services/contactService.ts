import Contact, { IContact } from '../models/Contact';

interface ContactFilters {
  search?: string;
  company?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface CreateContactInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  notes?: string;
  createdBy: string;
}

export async function getContacts(filters: ContactFilters): Promise<{ contacts: IContact[]; total: number }> {
  const { search, company, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 50 } = filters;
  
  const query: Record<string, unknown> = {};
  
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
    ];
  }
  
  if (company) query.company = { $regex: company, $options: 'i' };

  const skip = (page - 1) * limit;
  
  const [contacts, total] = await Promise.all([
    Contact.find(query)
      .populate('createdBy', 'name email')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit),
    Contact.countDocuments(query),
  ]);

  return { contacts, total };
}

export async function getContactById(id: string): Promise<IContact | null> {
  return Contact.findById(id).populate('createdBy', 'name email');
}

export async function createContact(input: CreateContactInput): Promise<IContact> {
  return Contact.create(input);
}

export async function updateContact(id: string, input: Partial<CreateContactInput>): Promise<IContact | null> {
  return Contact.findByIdAndUpdate(id, input, { new: true }).populate('createdBy', 'name email');
}

export async function deleteContact(id: string): Promise<void> {
  await Contact.findByIdAndDelete(id);
}
