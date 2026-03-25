export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  roles: string[];
  permissions: string[];
  created_at: string;
  updated_at?: string;
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  full_name?: string;
  email: string | null;
  phone: string | null;
  company_id: number | null;
  company?: Company;
  job_title: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  status: 'active' | 'inactive' | 'prospect';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: number;
  name: string;
  industry: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: number;
  title: string;
  customer_id: number | null;
  customer?: Customer;
  assigned_to: number | null;
  assignedTo?: User;
  source: string | null;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';
  value: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Opportunity {
  id: number;
  title: string;
  customer_id: number | null;
  customer?: Customer;
  assigned_to: number | null;
  assignedTo?: User;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  status: 'open' | 'won' | 'lost';
  value: number | null;
  expected_close_date: string | null;
  probability: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  assigned_to: number | null;
  assignedTo?: User;
  created_by: number | null;
  createdBy?: User;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: number;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  description: string;
  user_id: number | null;
  user?: User;
  subject_type: string | null;
  subject_id: number | null;
  scheduled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_customers: number;
  total_leads: number;
  total_opportunities: number;
  total_tasks: number;
  open_tasks: number;
  total_users: number;
  revenue_opportunities: number;
  pipeline_value: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: Record<string, string[]>;
}
