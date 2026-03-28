import api from '@/services/api';
import type { AnalyticsData } from '@/types';

export const analyticsService = {
  getAnalytics: async (period: string = '30d'): Promise<AnalyticsData> => {
    const { data } = await api.get('/admin/analytics', { params: { period } });
    return data.data;
  },
  getStats: async () => {
    const { data } = await api.get('/admin');
    return data.data;
  },
};
