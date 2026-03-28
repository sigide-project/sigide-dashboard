import api from '@/services/api';

interface GetFeedbackParams {
  page?: number;
  limit?: number;
  min_rating?: number;
  max_rating?: number;
  sort?: string;
  order?: string;
}

export const feedbackService = {
  getAll: async (params: GetFeedbackParams = {}) => {
    const { data } = await api.get('/admin/feedback', { params });
    return data.data;
  },
};
