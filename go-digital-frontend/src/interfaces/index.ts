// ========================
// API Response Wrapper (used only in mock mode)
// ========================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

// ========================
// Authentication
// ========================
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  department: string;
  role: 'user' | 'dx_team' | 'admin';
  avatar?: string;
}

// ========================
// Backend DTOs (match .NET API exactly)
// ========================
export interface StatusDto {
  id: number;
  name: string;
}

export interface DepartmentDto {
  id: number;
  name: string;
}

export interface RequestCommentDto {
  id: number;
  comment: string;
  createdAt: string;
  userName: string;
}

export interface RequestDto {
  id: number;
  title: string;
  description: string;
  currentProcess: string;
  problem: string;
  expectedImpact: string;
  priority: string;
  createdAt: string;
  status: StatusDto | null;
  department: DepartmentDto | null;
  userName: string;
  comments: RequestCommentDto[];
}

export interface CreateRequestDto {
  title: string;
  description: string;
  currentProcess: string;
  problem: string;
  expectedImpact: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  userId: number;
  departmentId: number;
}

export interface CreateCommentDto {
  userId: number;
  comment: string;
}

export interface UpdateStatusDto {
  statusId: number;
}

// ========================
// Catalogs (frontend abstraction)
// ========================
export interface CatalogItem {
  id: number;
  label: string;
  value: string;
  color?: string;
  icon?: string;
}

export interface Catalogs {
  statuses: CatalogItem[];
  departments: CatalogItem[];
  priorities: CatalogItem[];
  categories: CatalogItem[];
}

// ========================
// Frontend view models (mapped from backend DTOs)
// ========================
export interface DxRequest {
  id: number;
  title: string;
  department: string;
  departmentId: number;
  requester: string;
  category: string;
  currentProcess: string;
  problemOpportunity: string;
  expectedImpact: string;
  priority: string;
  status: string;
  statusId: number;
  attachments: Attachment[];
  comments: Comment[];
  history: HistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequestPayload {
  title: string;
  department: string;
  requester: string;
  category: string;
  currentProcess: string;
  problemOpportunity: string;
  expectedImpact: string;
  priority: string;
  attachments?: File[];
}

export interface Attachment {
  id: number;
  name: string;
  url: string;
  size: number;
  type: string;
}

// ========================
// Comments
// ========================
export interface Comment {
  id: number;
  requestId: number;
  content: string;
  author: string;
  authorRole: 'user' | 'dx_team';
  authorAvatar?: string;
  createdAt: string;
}

export interface CreateCommentPayload {
  requestId: number;
  content: string;
}

// ========================
// History
// ========================
export interface HistoryEntry {
  id: number;
  action: string;
  description: string;
  user: string;
  createdAt: string;
}

// ========================
// Filters
// ========================
export interface RequestFilters {
  status?: string | undefined;
  statusId?: number | undefined;
  department?: string | undefined;
  departmentId?: number | undefined;
  priority?: string | undefined;
  search?: string | undefined;
  page?: number | undefined;
  limit?: number | undefined;
}

// ========================
// Pagination
// ========================
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
