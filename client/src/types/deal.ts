export type DealStage = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Won' | 'Lost';

export interface Deal {
  _id: string;
  title: string;
  company: string;
  contact?: ContactRef;
  value: number;
  stage: DealStage;
  probability: number;
  expectedCloseDate?: string;
  assignedTo: UserRef;
  createdAt: string;
  updatedAt: string;
}

export interface UserRef {
  _id: string;
  name: string;
  email: string;
}

export interface ContactRef {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface CreateDealInput {
  title: string;
  company: string;
  contact?: string;
  value?: number;
  stage?: DealStage;
  probability?: number;
  expectedCloseDate?: string;
  assignedTo?: string;
}
