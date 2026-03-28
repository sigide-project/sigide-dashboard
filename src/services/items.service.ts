import api from '@/services/api';

interface GetItemsParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
  category?: string;
  sort?: string;
  order?: string;
}

export const itemsService = {
  getAll: async (params: GetItemsParams = {}) => {
    const { data } = await api.get('/admin/items', { params });
    return data.data;
  },
  getById: async (id: string) => {
    const { data } = await api.get(`/admin/items/${id}`);
    return data.data;
  },
  updateStatus: async (id: string, status: string) => {
    const { data } = await api.patch(`/admin/items/${id}/status`, { status });
    return data.data;
  },
  delete: async (id: string) => {
    await api.delete(`/admin/items/${id}`);
  },
};
