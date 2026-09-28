export interface DemoUser {
  email: string;
  password: string;
  role: 'Admin' | 'Manager' | 'SalesRep';
  name: string;
}

export const DEMO_USERS: DemoUser[] = [
  { email: 'admin@clienthub.com', password: 'Admin@1234', role: 'Admin', name: 'Admin User' },
  { email: 'manager@clienthub.com', password: 'Manager@1234', role: 'Manager', name: 'Manager User' },
  { email: 'sales@clienthub.com', password: 'Sales@1234', role: 'SalesRep', name: 'Sales Rep User' },
];
