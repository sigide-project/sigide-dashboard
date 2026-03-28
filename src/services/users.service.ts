import api from '@/services/api';

interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  sort?: string;
  order?: string;
}

export const usersService = {
  getAll: async (params: GetUsersParams = {}) => {
    const { data } = await api.get('/admin/users', { params });
    return data.data;
  },
  getById: async (id: string) => {
    const { data } = await api.get(`/admin/users/${id}`);
    return data.data;
  },
  ban: async (id: string) => {
    const { data } = await api.patch(`/admin/users/${id}/ban`);
    return data.data;
  },
  unban: async (id: string) => {
    const { data } = await api.patch(`/admin/users/${id}/unban`);
    return data.data;
  },
  makeAdmin: async (id: string) => {
    const { data } = await api.patch(`/admin/users/${id}/make-admin`);
    return data.data;
  },
};
