import api from '@/services/api';

interface GetReportsParams {
  page?: number;
  limit?: number;
  status?: string;
  issue_type?: string;
  sort?: string;
  order?: string;
}

export const reportsService = {
  getAll: async (params: GetReportsParams = {}) => {
    const { data } = await api.get('/admin/reports', { params });
    return data.data;
  },
  getById: async (id: string) => {
    const { data } = await api.get(`/admin/reports/${id}`);
    return data.data;
  },
  updateStatus: async (id: string, status: string) => {
    const { data } = await api.patch(`/admin/reports/${id}/status`, { status });
    return data.data;
  },
};
