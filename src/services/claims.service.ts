import api from '@/services/api';

interface GetClaimsParams {
  page?: number;
  limit?: number;
  status?: string;
  sort?: string;
  order?: string;
}

export const claimsService = {
  getAll: async (params: GetClaimsParams = {}) => {
    const { data } = await api.get('/admin/claims', { params });
    return data.data;
  },
  getById: async (id: string) => {
    const { data } = await api.get(`/admin/claims/${id}`);
    return data.data;
  },
  updateStatus: async (id: string, status: string) => {
    const { data } = await api.patch(`/admin/claims/${id}/status`, { status });
    return data.data;
  },
};
