import bcrypt from 'bcrypt';
import User from '../models/User';
import Lead from '../models/Lead';
import Contact from '../models/Contact';
import Company from '../models/Company';
import Deal from '../models/Deal';
import Task from '../models/Task';
import Notification from '../models/Notification';
import { DEMO_USERS } from '../config/demoUsers';

export async function seedDemoUsers(): Promise<void> {
  console.log('[SEED] Seeding demo users...');
  
  for (const u of DEMO_USERS) {
    const password = await bcrypt.hash(u.password, 10);
    await User.updateOne(
      { email: u.email },
      { $set: { email: u.email, password, role: u.role, name: u.name } },
      { upsert: true }
    );
  }
  
  console.log('[SEED] Demo users seeded');
}

export async function seedSampleData(): Promise<void> {
  // Check if data already exists
  const existingLeads = await Lead.countDocuments();
  if (existingLeads > 0) {
    console.log('[SEED] Sample data already exists, skipping...');
    return;
  }

  console.log('[SEED] Seeding sample data...');

  // Get user IDs
  const users = await User.find();
  const adminUser = users.find(u => u.role === 'Admin');
  const managerUser = users.find(u => u.role === 'Manager');
  const salesUser = users.find(u => u.role === 'SalesRep');
  
  if (!adminUser || !managerUser || !salesUser) {
    console.log('[SEED] Demo users not found, skipping sample data seed');
    return;
  }

  // Seed Companies
  const companies = await Company.insertMany([
    { name: 'Acme Corporation', industry: 'Technology', size: '500-1000', website: 'https://acme.com', phone: '(555) 123-4567' },
    { name: 'Global Industries', industry: 'Manufacturing', size: '1000-5000', website: 'https://global-ind.com', phone: '(555) 234-5678' },
    { name: 'TechStart Inc', industry: 'Software', size: '50-200', website: 'https://techstart.io', phone: '(555) 345-6789' },
    { name: 'HealthFirst Medical', industry: 'Healthcare', size: '200-500', website: 'https://healthfirst.com', phone: '(555) 456-7890' },
    { name: 'FinancePlus Corp', industry: 'Financial Services', size: '100-500', website: 'https://financeplus.com', phone: '(555) 567-8901' },
    { name: 'RetailMax Stores', industry: 'Retail', size: '1000-5000', website: 'https://retailmax.com', phone: '(555) 678-9012' },
    { name: 'EduLearn Academy', industry: 'Education', size: '50-200', website: 'https://edulearn.edu', phone: '(555) 789-0123' },
    { name: 'GreenEnergy Solutions', industry: 'Energy', size: '200-500', website: 'https://greenenergy.com', phone: '(555) 890-1234' },
    { name: 'MediaWorks Agency', industry: 'Marketing', size: '20-50', website: 'https://mediaworks.agency', phone: '(555) 901-2345' },
    { name: 'LogiTrans Shipping', industry: 'Logistics', size: '500-1000', website: 'https://logitrans.com', phone: '(555) 012-3456' },
  ]);

  // Seed Contacts
  const contacts = await Contact.insertMany([
    { firstName: 'John', lastName: 'Smith', email: 'john.smith@acme.com', phone: '(555) 111-2222', company: 'Acme Corporation', position: 'CTO', createdBy: adminUser._id },
    { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.j@global-ind.com', phone: '(555) 222-3333', company: 'Global Industries', position: 'VP Sales', createdBy: adminUser._id },
    { firstName: 'Michael', lastName: 'Brown', email: 'michael@techstart.io', phone: '(555) 333-4444', company: 'TechStart Inc', position: 'CEO', createdBy: managerUser._id },
    { firstName: 'Emily', lastName: 'Davis', email: 'emily.d@healthfirst.com', phone: '(555) 444-5555', company: 'HealthFirst Medical', position: 'Director', createdBy: managerUser._id },
    { firstName: 'David', lastName: 'Wilson', email: 'david.w@financeplus.com', phone: '(555) 555-6666', company: 'FinancePlus Corp', position: 'CFO', createdBy: salesUser._id },
    { firstName: 'Lisa', lastName: 'Anderson', email: 'lisa@retailmax.com', phone: '(555) 666-7777', company: 'RetailMax Stores', position: 'Buyer', createdBy: salesUser._id },
    { firstName: 'Robert', lastName: 'Taylor', email: 'robert.t@edulearn.edu', phone: '(555) 777-8888', company: 'EduLearn Academy', position: 'Principal', createdBy: adminUser._id },
    { firstName: 'Jennifer', lastName: 'Martinez', email: 'jennifer@greenenergy.com', phone: '(555) 888-9999', company: 'GreenEnergy Solutions', position: 'Operations Manager', createdBy: managerUser._id },
    { firstName: 'William', lastName: 'Garcia', email: 'william@mediaworks.agency', phone: '(555) 999-0000', company: 'MediaWorks Agency', position: 'Creative Director', createdBy: salesUser._id },
    { firstName: 'Amanda', lastName: 'Lopez', email: 'amanda.l@logitrans.com', phone: '(555) 000-1111', company: 'LogiTrans Shipping', position: 'Logistics Manager', createdBy: adminUser._id },
    { firstName: 'James', lastName: 'Harris', email: 'james.h@acme.com', phone: '(555) 121-2121', company: 'Acme Corporation', position: 'Product Manager', createdBy: managerUser._id },
    { firstName: 'Jessica', lastName: 'Clark', email: 'jessica.c@global-ind.com', phone: '(555) 232-3232', company: 'Global Industries', position: 'HR Director', createdBy: salesUser._id },
    { firstName: 'Daniel', lastName: 'Lewis', email: 'daniel@techstart.io', phone: '(555) 343-4343', company: 'TechStart Inc', position: 'Lead Developer', createdBy: adminUser._id },
    { firstName: 'Michelle', lastName: 'Robinson', email: 'michelle.r@healthfirst.com', phone: '(555) 454-5454', company: 'HealthFirst Medical', position: 'Nurse Manager', createdBy: managerUser._id },
    { firstName: 'Christopher', lastName: 'Walker', email: 'chris.w@financeplus.com', phone: '(555) 565-6565', company: 'FinancePlus Corp', position: 'Investment Advisor', createdBy: salesUser._id },
  ]);

  // Seed Leads
  const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'] as const;
  const leads = [];
  for (let i = 0; i < 20; i++) {
    const stage = stages[i % stages.length];
    const assignedTo = i % 3 === 0 ? adminUser._id : i % 3 === 1 ? managerUser._id : salesUser._id;
    leads.push({
      title: `Lead ${i + 1} - ${companies[i % companies.length].name}`,
      company: companies[i % companies.length].name,
      contactName: contacts[i % contacts.length].firstName + ' ' + contacts[i % contacts.length].lastName,
      email: contacts[i % contacts.length].email,
      phone: contacts[i % contacts.length].phone,
      stage,
      value: Math.floor(Math.random() * 50000) + 5000,
      assignedTo,
      notes: `Notes for lead ${i + 1}`,
    });
  }
  await Lead.insertMany(leads);

  // Seed Deals
  const deals = [];
  for (let i = 0; i < 12; i++) {
    const stage = stages[i % stages.length];
    const assignedTo = i % 3 === 0 ? adminUser._id : i % 3 === 1 ? managerUser._id : salesUser._id;
    const expectedCloseDate = new Date();
    expectedCloseDate.setDate(expectedCloseDate.getDate() + Math.floor(Math.random() * 90));
    
    deals.push({
      title: `Deal ${i + 1} - Enterprise Solution`,
      company: companies[i % companies.length].name,
      contact: contacts[i % contacts.length]._id,
      value: Math.floor(Math.random() * 100000) + 10000,
      stage,
      probability: Math.floor(Math.random() * 80) + 10,
      expectedCloseDate,
      assignedTo,
    });
  }
  await Deal.insertMany(deals);

  // Seed Tasks
  const priorities = ['Low', 'Medium', 'High', 'Urgent'] as const;
  const statuses = ['Pending', 'In Progress', 'Completed', 'Cancelled'] as const;
  const tasks = [];
  for (let i = 0; i < 25; i++) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30) - 10);
    const assignedTo = i % 3 === 0 ? adminUser._id : i % 3 === 1 ? managerUser._id : salesUser._id;
    
    tasks.push({
      title: `Task ${i + 1}: Follow up with client`,
      description: `Description for task ${i + 1}. Complete the required actions.`,
      dueDate,
      priority: priorities[i % priorities.length],
      status: statuses[i % statuses.length],
      assignedTo,
    });
  }
  await Task.insertMany(tasks);

  // Seed Notifications
  const notificationTypes = ['info', 'success', 'warning', 'task', 'deal', 'lead'] as const;
  const notifications = [];
  for (let i = 0; i < 30; i++) {
    const userId = i % 3 === 0 ? adminUser._id : i % 3 === 1 ? managerUser._id : salesUser._id;
    notifications.push({
      userId,
      type: notificationTypes[i % notificationTypes.length],
      message: `Notification message ${i + 1}: Something important happened`,
      read: i % 2 === 0,
    });
  }
  await Notification.insertMany(notifications);

  console.log('[SEED] Sample data seeded successfully');
}
