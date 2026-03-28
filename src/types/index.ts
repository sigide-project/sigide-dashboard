import type { ReactNode } from 'react';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  rating: number;
  role: 'user' | 'admin' | 'banned';
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  items_count?: number;
  claims_count?: number;
}

export interface Item {
  id: string;
  user_id: string;
  type: 'lost' | 'found';
  status: 'open' | 'claimed' | 'resolved' | 'cancelled';
  title: string;
  description: string | null;
  category: string | null;
  image_urls: string[];
  location_name: string | null;
  reward_amount: number;
  lost_found_at: string | null;
  createdAt: string;
  updatedAt: string;
  owner?: Pick<User, 'id' | 'name' | 'email' | 'avatar_url'>;
  claims?: Claim[];
  claims_count?: number;
}

export interface Claim {
  id: string;
  item_id: string;
  claimant_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'resolved' | 'disputed';
  proof_description: string | null;
  proof_images: string[];
  resolved_at: string | null;
  createdAt: string;
  updatedAt: string;
  item?: Pick<Item, 'id' | 'title' | 'type'>;
  claimant?: Pick<User, 'id' | 'name' | 'email' | 'avatar_url'>;
  owner?: Pick<User, 'id' | 'name' | 'email' | 'avatar_url'>;
  messages?: Message[];
}

export interface Message {
  id: string;
  claim_id: string;
  sender_id: string;
  content: string;
  read_at: string | null;
  createdAt: string;
  sender?: Pick<User, 'id' | 'name' | 'avatar_url'>;
}

export interface Report {
  id: string;
  user_id: string | null;
  issue_type: string;
  email: string;
  listing_url: string | null;
  description: string;
  status: 'open' | 'reviewing' | 'resolved' | 'dismissed';
  createdAt: string;
  updatedAt: string;
}

export interface Feedback {
  id: string;
  user_id: string | null;
  rating: number | null;
  name: string | null;
  email: string | null;
  feedback: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  total_users: number;
  total_items: number;
  open_items: number;
  claimed_items: number;
  resolved_items: number;
  total_claims: number;
  pending_claims: number;
  accepted_claims: number;
  total_reports: number;
  open_reports: number;
  new_feedback_count: number;
  new_contacts_count: number;
}

export interface AnalyticsData {
  items_over_time: { date: string; lost: number; found: number; resolved: number }[];
  claims_over_time: { date: string; submitted: number; accepted: number }[];
  top_categories: { category: string; count: number }[];
  top_locations: { location_name: string; count: number }[];
  user_signups_over_time: { date: string; count: number }[];
  resolution_rate: number;
  avg_resolution_days: number;
  feedback_avg_rating: number;
  rating_distribution: { rating: number; count: number }[];
}

export interface PaginatedResponse<T> {
  [key: string]: T[] | number;
  total: number;
  page: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export interface Column<T> {
  key: string;
  label: string;
  width?: string | number;
  render?: (row: T) => ReactNode;
}
