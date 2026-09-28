export type LeadStage = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Won' | 'Lost';

export interface Lead {
  _id: string;
  title: string;
  company: string;
  contactName: string;
  email: string;
  phone?: string;
  stage: LeadStage;
  value: number;
  assignedTo: UserRef;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserRef {
  _id: string;
  name: string;
  email: string;
}

export interface CreateLeadInput {
  title: string;
  company: string;
  contactName: string;
  email: string;
  phone?: string;
  stage?: LeadStage;
  value?: number;
  assignedTo?: string;
  notes?: string;
}
