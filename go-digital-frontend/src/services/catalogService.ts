import { apiGet } from './api';
import type { Catalogs, ApiResponse, StatusDto, DepartmentDto } from 'src/interfaces';

const DEV_MOCK = import.meta.env.VITE_DEV_MOCK === 'true';

// ─── Mock catalogs ───
async function mockGetCatalogs(): Promise<ApiResponse<Catalogs>> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    success: true,
    data: {
      statuses: [
        { id: 1, label: 'Pending', value: 'pending', color: '#f59e0b', icon: 'schedule' },
        { id: 2, label: 'In Review', value: 'in_review', color: '#3b82f6', icon: 'rate_review' },
        { id: 3, label: 'In Progress', value: 'in_progress', color: '#8b5cf6', icon: 'autorenew' },
        { id: 4, label: 'Completed', value: 'completed', color: '#22c55e', icon: 'check_circle' },
        { id: 5, label: 'Rejected', value: 'rejected', color: '#ef4444', icon: 'cancel' },
      ],
      departments: [
        { id: 1, label: 'Finance', value: '1' },
        { id: 2, label: 'Human Resources', value: '2' },
        { id: 3, label: 'Operations', value: '3' },
        { id: 4, label: 'Quality', value: '4' },
        { id: 5, label: 'Supply Chain', value: '5' },
        { id: 6, label: 'Maintenance', value: '6' },
        { id: 7, label: 'Digital Transformation', value: '7' },
        { id: 8, label: 'IT', value: '8' },
      ],
      priorities: [
        { id: 1, label: 'Low', value: 'low', color: '#22c55e' },
        { id: 2, label: 'Medium', value: 'medium', color: '#f59e0b' },
        { id: 3, label: 'High', value: 'high', color: '#f97316' },
        { id: 4, label: 'Critical', value: 'critical', color: '#ef4444' },
      ],
      categories: [
        { id: 1, label: 'Process Automation', value: 'Process Automation' },
        { id: 2, label: 'Web Application', value: 'Web Application' },
        { id: 3, label: 'Mobile Application', value: 'Mobile Application' },
        { id: 4, label: 'Business Intelligence', value: 'Business Intelligence' },
        { id: 5, label: 'Data Integration', value: 'Data Integration' },
        { id: 6, label: 'Document Management', value: 'Document Management' },
        { id: 7, label: 'Other', value: 'Other' },
      ],
    },
    message: '',
  };
}

// Status name → color mapping
const STATUS_COLORS: Record<string, string> = {
  // Spanish backend statuses
  'nuevo': '#f59e0b',
  'en revisión dx': '#3b82f6',
  'en backlog': '#8b5cf6',
  'en desarrollo': '#6366f1',
  'en pruebas': '#06b6d4',
  'entregado': '#22c55e',
  'cerrado': '#64748b',
  // English fallbacks
  'new': '#f59e0b',
  'in review': '#3b82f6',
  'in progress': '#8b5cf6',
  'completed': '#22c55e',
  'rejected': '#ef4444',
  'pending': '#f59e0b',
};

export const catalogService = {
  async getCatalogs(): Promise<ApiResponse<Catalogs>> {
    if (DEV_MOCK) return mockGetCatalogs();

    // Real API: fetch from two separate endpoints
    const [statusDtos, departmentDtos] = await Promise.all([
      apiGet<StatusDto[]>('/Status'),
      apiGet<DepartmentDto[]>('/Departments'),
    ]);

    const catalogs: Catalogs = {
      statuses: statusDtos.map((s) => ({
        id: s.id,
        label: s.name,
        value: s.name,
        color: STATUS_COLORS[s.name.toLowerCase()] || '#6366f1',
      })),
      departments: departmentDtos.map((d) => ({
        id: d.id,
        label: d.name,
        value: String(d.id), // Use ID as value for backend filtering
      })),
      priorities: [
        { id: 1, label: 'Low', value: 'low', color: '#22c55e' },
        { id: 2, label: 'Medium', value: 'medium', color: '#f59e0b' },
        { id: 3, label: 'High', value: 'high', color: '#f97316' },
        { id: 4, label: 'Critical', value: 'critical', color: '#ef4444' },
      ],
      categories: [
        { id: 1, label: 'Process Automation', value: 'Process Automation' },
        { id: 2, label: 'Web Application', value: 'Web Application' },
        { id: 3, label: 'Mobile Application', value: 'Mobile Application' },
        { id: 4, label: 'Business Intelligence', value: 'Business Intelligence' },
        { id: 5, label: 'Other', value: 'Other' },
      ],
    };

    return { success: true, data: catalogs, message: '' };
  },
};
