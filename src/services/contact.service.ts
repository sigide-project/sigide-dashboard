import api from '@/services/api';

interface GetContactParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: string;
}

export const contactService = {
  getAll: async (params: GetContactParams = {}) => {
    const { data } = await api.get('/admin/contact', { params });
    return data.data;
  },
};
