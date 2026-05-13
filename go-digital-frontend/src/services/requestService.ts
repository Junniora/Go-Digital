import api, { apiGet, apiPost } from './api';
import type {
  DxRequest, RequestFilters, PaginatedResponse, ApiResponse,
  RequestDto, RequestCommentDto, CreateRequestDto, CreateCommentDto,
  Comment,
} from 'src/interfaces';

const DEV_MOCK = import.meta.env.VITE_DEV_MOCK === 'true';

// ═══════════════════════════════════════
// DTO → Frontend Model Mappers
// ═══════════════════════════════════════
function mapRequestDtoToView(dto: RequestDto): DxRequest {
  return {
    id: dto.id,
    title: dto.title,
    department: dto.department?.name ?? '',
    departmentId: dto.department?.id ?? 0,
    requester: dto.userName,
    category: '',
    currentProcess: dto.currentProcess,
    problemOpportunity: dto.problem,
    expectedImpact: dto.expectedImpact,
    priority: dto.priority.toLowerCase(),
    status: dto.status?.name ?? 'Nuevo',
    statusId: dto.status?.id ?? 0,
    attachments: [],
    comments: (dto.comments ?? []).map((c) => mapCommentDtoToView(c, dto.id)),
    history: [],
    createdAt: dto.createdAt,
    updatedAt: dto.createdAt,
  };
}

function mapCommentDtoToView(dto: RequestCommentDto, requestId: number): Comment {
  return {
    id: dto.id,
    requestId,
    content: dto.comment,
    author: dto.userName,
    authorRole: 'user',
    createdAt: dto.createdAt,
  };
}

// ═══════════════════════════════════════
// Mock data for development
// ═══════════════════════════════════════
const MOCK_REQUESTS: DxRequest[] = [
  {
    id: 1, title: 'Automate Invoice Processing', department: 'Finance', departmentId: 1,
    requester: 'Carlos Mendez', category: 'Process Automation',
    currentProcess: 'Invoices are manually entered into the ERP system. Each takes ~15 minutes.',
    problemOpportunity: 'High error rate (8%) in manual data entry leading to payment delays.',
    expectedImpact: 'Reduce processing time by 80%, eliminate data entry errors.',
    priority: 'high', status: 'in_progress', statusId: 3,
    attachments: [],
    comments: [
      { id: 1, requestId: 1, content: 'We evaluated three RPA tools. UiPath is most suitable.', author: 'Maria DX', authorRole: 'dx_team', createdAt: '2026-04-15T10:30:00Z' },
      { id: 2, requestId: 1, content: 'Can we schedule a demo with the finance team?', author: 'Carlos Mendez', authorRole: 'user', createdAt: '2026-04-16T14:20:00Z' },
    ],
    history: [
      { id: 1, action: 'created', description: 'Request created', user: 'Carlos Mendez', createdAt: '2026-04-10T09:00:00Z' },
      { id: 2, action: 'status_change', description: 'Status → In Review', user: 'Maria DX', createdAt: '2026-04-12T11:00:00Z' },
      { id: 3, action: 'status_change', description: 'Status → In Progress', user: 'Maria DX', createdAt: '2026-04-14T16:00:00Z' },
    ],
    createdAt: '2026-04-10T09:00:00Z', updatedAt: '2026-04-16T14:20:00Z',
  },
  {
    id: 2, title: 'Employee Onboarding Portal', department: 'Human Resources', departmentId: 2,
    requester: 'Ana García', category: 'Web Application',
    currentProcess: 'New employees receive 12 paper forms on day 1. HR enters data into 4 systems.',
    problemOpportunity: 'Onboarding takes 3-5 days. Poor first-day experience.',
    expectedImpact: 'Digital onboarding in 2 hours. Reduce HR admin burden by 40%.',
    priority: 'critical', status: 'pending', statusId: 1,
    attachments: [], comments: [],
    history: [{ id: 4, action: 'created', description: 'Request created', user: 'Ana García', createdAt: '2026-04-20T08:30:00Z' }],
    createdAt: '2026-04-20T08:30:00Z', updatedAt: '2026-04-20T08:30:00Z',
  },
  {
    id: 3, title: 'Warehouse Inventory Scanner', department: 'Operations', departmentId: 3,
    requester: 'Roberto Salinas', category: 'Mobile Application',
    currentProcess: 'Staff manually count inventory with clipboards. Data entered into Excel end-of-shift.',
    problemOpportunity: 'Inventory accuracy only 85%. Discrepancies cause shipping delays.',
    expectedImpact: 'Achieve 99.5% accuracy. Real-time visibility. Eliminate 20hrs/week manual work.',
    priority: 'high', status: 'completed', statusId: 4,
    attachments: [],
    comments: [{ id: 3, requestId: 3, content: 'App deployed. Training sessions completed.', author: 'Maria DX', authorRole: 'dx_team', createdAt: '2026-03-28T09:00:00Z' }],
    history: [
      { id: 5, action: 'created', description: 'Request created', user: 'Roberto Salinas', createdAt: '2026-02-01T10:00:00Z' },
      { id: 7, action: 'status_change', description: 'Status → Completed', user: 'Maria DX', createdAt: '2026-03-28T09:00:00Z' },
    ],
    createdAt: '2026-02-01T10:00:00Z', updatedAt: '2026-03-28T09:00:00Z',
  },
  {
    id: 4, title: 'Customer Feedback Dashboard', department: 'Quality', departmentId: 4,
    requester: 'Laura Vega', category: 'Business Intelligence',
    currentProcess: 'Feedback collected through email/phone. Monthly PowerPoint reports.',
    problemOpportunity: 'No real-time visibility. Reports outdated by the time they reach management.',
    expectedImpact: 'Real-time sentiment analysis. Automated dashboards with drill-down.',
    priority: 'medium', status: 'in_review', statusId: 2,
    attachments: [], comments: [],
    history: [
      { id: 8, action: 'created', description: 'Request created', user: 'Laura Vega', createdAt: '2026-04-25T13:00:00Z' },
      { id: 9, action: 'status_change', description: 'Status → In Review', user: 'Maria DX', createdAt: '2026-04-28T10:00:00Z' },
    ],
    createdAt: '2026-04-25T13:00:00Z', updatedAt: '2026-04-28T10:00:00Z',
  },
  {
    id: 5, title: 'Digital Maintenance Work Orders', department: 'Maintenance', departmentId: 5,
    requester: 'Pedro Castillo', category: 'Process Automation',
    currentProcess: 'Work orders on paper. Technicians get assignments via radio.',
    problemOpportunity: 'No tracking history. Average resolution time unknown.',
    expectedImpact: 'Complete digital lifecycle. Reduce mean time to repair by 30%.',
    priority: 'low', status: 'pending', statusId: 1,
    attachments: [], comments: [],
    history: [{ id: 10, action: 'created', description: 'Request created', user: 'Pedro Castillo', createdAt: '2026-05-01T07:00:00Z' }],
    createdAt: '2026-05-01T07:00:00Z', updatedAt: '2026-05-01T07:00:00Z',
  },
  {
    id: 6, title: 'Supplier Qualification Portal', department: 'Supply Chain', departmentId: 6,
    requester: 'Diana Torres', category: 'Web Application',
    currentProcess: 'Supplier docs exchanged via email. Approvals require 5 physical signatures.',
    problemOpportunity: 'Qualification takes 45-60 days. Incomplete audit trail.',
    expectedImpact: 'Reduce to 15 days. Full audit trail. Automated compliance checks.',
    priority: 'medium', status: 'in_progress', statusId: 3,
    attachments: [],
    comments: [{ id: 4, requestId: 6, content: 'Wireframes ready for review.', author: 'Maria DX', authorRole: 'dx_team', createdAt: '2026-04-22T16:00:00Z' }],
    history: [
      { id: 11, action: 'created', description: 'Request created', user: 'Diana Torres', createdAt: '2026-04-05T11:00:00Z' },
      { id: 12, action: 'status_change', description: 'Status → In Progress', user: 'Maria DX', createdAt: '2026-04-18T09:00:00Z' },
    ],
    createdAt: '2026-04-05T11:00:00Z', updatedAt: '2026-04-22T16:00:00Z',
  },
];

let mockIdCounter = MOCK_REQUESTS.length + 1;

// ═══════════════════════════════════════
// Service
// ═══════════════════════════════════════
export const requestService = {
  // ─── GET ALL ───
  async getRequests(filters?: RequestFilters): Promise<ApiResponse<PaginatedResponse<DxRequest>>> {
    if (DEV_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      return {
        success: true,
        data: { items: MOCK_REQUESTS, total: MOCK_REQUESTS.length, page: 1, limit: 25, totalPages: 1 },
        message: '',
      };
    }

    // Real API: GET /api/Requests?statusId=&departmentId=&priority=
    const params: Record<string, unknown> = {};
    if (filters?.statusId) params.statusId = filters.statusId;
    if (filters?.departmentId) params.departmentId = filters.departmentId;
    if (filters?.priority) {
      // Convert lowercase to PascalCase for .NET enum
      const p = filters.priority;
      params.priority = p.charAt(0).toUpperCase() + p.slice(1);
    }

    const dtos = await apiGet<RequestDto[]>('/Requests', params);
    const items = dtos.map(mapRequestDtoToView);
    return {
      success: true,
      data: { items, total: items.length, page: 1, limit: items.length, totalPages: 1 },
      message: '',
    };
  },

  // ─── GET BY ID ───
  async getRequestById(id: number): Promise<ApiResponse<DxRequest>> {
    if (DEV_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      const found = MOCK_REQUESTS.find((r) => r.id === id);
      return found
        ? { success: true, data: found, message: '' }
        : { success: false, data: {} as DxRequest, message: 'Not found' };
    }

    const dto = await apiGet<RequestDto>(`/Requests/${id}`);
    return { success: true, data: mapRequestDtoToView(dto), message: '' };
  },

  // ─── CREATE ───
  async createRequest(formData: FormData): Promise<ApiResponse<DxRequest>> {
    if (DEV_MOCK) {
      await new Promise((r) => setTimeout(r, 600));
      const newReq: DxRequest = {
        id: mockIdCounter++,
        title: formData.get('title') as string || 'New Request',
        department: formData.get('department') as string || 'General',
        departmentId: 1,
        requester: formData.get('requester') as string || 'User',
        category: formData.get('category') as string || 'Other',
        currentProcess: formData.get('currentProcess') as string || '',
        problemOpportunity: formData.get('problemOpportunity') as string || '',
        expectedImpact: formData.get('expectedImpact') as string || '',
        priority: formData.get('priority') as string || 'medium',
        status: 'pending', statusId: 1,
        attachments: [], comments: [],
        history: [{ id: Date.now(), action: 'created', description: 'Request created', user: 'Current User', createdAt: new Date().toISOString() }],
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
      MOCK_REQUESTS.push(newReq);
      return { success: true, data: newReq, message: 'Created' };
    }

    // Real API: POST /api/Requests with JSON body
    const priorityMap: Record<string, string> = { low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical' };
    const createDto: CreateRequestDto = {
      title: formData.get('title') as string || '',
      description: formData.get('currentProcess') as string || '',
      currentProcess: formData.get('currentProcess') as string || '',
      problem: formData.get('problemOpportunity') as string || '',
      expectedImpact: formData.get('expectedImpact') as string || '',
      priority: (priorityMap[formData.get('priority') as string] || 'Medium') as CreateRequestDto['priority'],
      userId: 1, // TODO: get from auth store
      departmentId: parseInt(formData.get('departmentId') as string) || 1,
    };

    const dto = await apiPost<RequestDto>('/Requests', createDto);
    return { success: true, data: mapRequestDtoToView(dto), message: 'Created' };
  },

  // ─── ADD COMMENT ───
  async addComment(requestId: number, content: string, userId: number = 1): Promise<ApiResponse<Comment>> {
    if (DEV_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      const c: Comment = {
        id: Date.now(), requestId, content, author: 'Current User', authorRole: 'user', createdAt: new Date().toISOString(),
      };
      return { success: true, data: c, message: 'Added' };
    }

    const dto: CreateCommentDto = { userId, comment: content };
    const result = await apiPost<RequestCommentDto>(`/Requests/${requestId}/comments`, dto);
    return { success: true, data: mapCommentDtoToView(result, requestId), message: 'Added' };
  },

  // ─── UPDATE STATUS ───
  async updateStatus(requestId: number, statusId: number): Promise<ApiResponse<boolean>> {
    if (DEV_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      return { success: true, data: true, message: 'Updated' };
    }

    await api.put(`/Requests/${requestId}/status`, { statusId });
    return { success: true, data: true, message: 'Updated' };
  },
};
