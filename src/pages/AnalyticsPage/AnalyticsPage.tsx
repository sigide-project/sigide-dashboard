import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import PercentOutlined from '@mui/icons-material/PercentOutlined';
import ScheduleOutlined from '@mui/icons-material/ScheduleOutlined';
import StarOutlined from '@mui/icons-material/StarOutlined';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { isAxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { LoadingSpinner, PageHeader, StatCard } from '@/components';
import { analyticsService } from '@/services';
import type { AnalyticsData } from '@/types';
import {
  AnalyticsRoot,
  ChartCard,
  ChartRow,
  ChartTitle,
  PeriodSelector,
  RatingBarFill,
  RatingBarLabel,
  RatingBarRow,
  RatingBars,
  RatingBarTrack,
  RatingBarValue,
  StatsRow,
} from './AnalyticsPage.styled';

type Period = '7d' | '30d' | '90d' | '1y';

const PIE_COLORS = [
  '#7C3AED',
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#EC4899',
  '#8B5CF6',
  '#06B6D4',
  '#84CC16',
  '#F97316',
];

const iconProps = { style: { fontSize: 24 } as const };

function normalizeItemsSeries(data: AnalyticsData['items_over_time']) {
  return data.map((row) => ({
    date: row.date,
    lost: Number(row.lost),
    found: Number(row.found),
    resolved: Number(row.resolved),
  }));
}

export function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('30d');

  const {
    data: analytics,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin', 'analytics', period],
    queryFn: () => analyticsService.getAnalytics(period),
  });

  const itemsSeries = useMemo(
    () => normalizeItemsSeries(analytics?.items_over_time ?? []),
    [analytics?.items_over_time],
  );

  const signupsSeries = useMemo(
    () =>
      (analytics?.user_signups_over_time ?? []).map((r) => ({
        date: r.date,
        count: Number(r.count),
      })),
    [analytics?.user_signups_over_time],
  );

  const claimsSeries = useMemo(
    () =>
      (analytics?.claims_over_time ?? []).map((r) => ({
        date: r.date,
        submitted: Number(r.submitted),
        accepted: Number(r.accepted),
      })),
    [analytics?.claims_over_time],
  );

  const locationsSeries = useMemo(
    () =>
      (analytics?.top_locations ?? []).map((r) => ({
        name: r.location_name || 'Unknown',
        count: Number(r.count),
      })),
    [analytics?.top_locations],
  );

  const categoryPie = useMemo(
    () =>
      (analytics?.top_categories ?? []).map((r) => ({
        name: r.category || 'Other',
        value: Number(r.count),
      })),
    [analytics?.top_categories],
  );

  const ratingDist = useMemo(() => {
    const list = analytics?.rating_distribution ?? [];
    const map = new Map(list.map((r) => [r.rating, r.count]));
    const total = list.reduce((a, r) => a + r.count, 0);
    return { map, total };
  }, [analytics?.rating_distribution]);

  const newUsersCount = useMemo(
    () => (analytics?.user_signups_over_time ?? []).reduce((a, r) => a + Number(r.count), 0),
    [analytics?.user_signups_over_time],
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !analytics) {
    const msg = isAxiosError(error) ? error.message : 'Failed to load analytics';
    return (
      <AnalyticsRoot>
        <PageHeader title="Analytics" />
        <Typography color="error" gutterBottom>
          {msg}
        </Typography>
        <Button variant="contained" onClick={() => refetch()}>
          Retry
        </Button>
      </AnalyticsRoot>
    );
  }

  return (
    <AnalyticsRoot>
      <PageHeader title="Analytics" />
      <PeriodSelector>
        <ToggleButtonGroup
          exclusive
          value={period}
          onChange={(_, v) => v && setPeriod(v)}
          size="small"
          color="primary"
        >
          <ToggleButton value="7d">7d</ToggleButton>
          <ToggleButton value="30d">30d</ToggleButton>
          <ToggleButton value="90d">90d</ToggleButton>
          <ToggleButton value="1y">1y</ToggleButton>
        </ToggleButtonGroup>
      </PeriodSelector>

      <StatsRow>
        <StatCard
          title="Resolution rate"
          value={`${Number(analytics.resolution_rate).toFixed(1)}%`}
          icon={<PercentOutlined {...iconProps} />}
          color="#10B981"
        />
        <StatCard
          title="Avg resolution time"
          value={`${Number(analytics.avg_resolution_days).toFixed(1)} days`}
          icon={<ScheduleOutlined {...iconProps} />}
          color="#3B82F6"
        />
        <StatCard
          title="New users (period)"
          value={newUsersCount}
          icon={<PeopleOutlined {...iconProps} />}
          color="#7C3AED"
        />
        <StatCard
          title="Avg feedback rating"
          value={Number(analytics.feedback_avg_rating).toFixed(2)}
          icon={<StarOutlined {...iconProps} />}
          color="#F59E0B"
        />
      </StatsRow>

      <ChartRow $split="3fr 2fr">
        <ChartCard variant="outlined">
          <ChartTitle>Items over time</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={itemsSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="lost"
                stroke="#EF4444"
                fill="#EF4444"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="found"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="resolved"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard variant="outlined">
          <ChartTitle>User signups over time</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={signupsSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#7C3AED" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartRow>

      <ChartRow>
        <ChartCard variant="outlined">
          <ChartTitle>Claims over time</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={claimsSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="submitted" fill="#7C3AED" />
              <Bar dataKey="accepted" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard variant="outlined">
          <ChartTitle>Top 10 locations</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              layout="vertical"
              data={locationsSeries.slice(0, 10)}
              margin={{ left: 8, right: 16 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartRow>

      <ChartRow>
        <ChartCard variant="outlined">
          <ChartTitle>Category breakdown</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryPie}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {categoryPie.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard variant="outlined">
          <ChartTitle>Feedback rating distribution</ChartTitle>
          <RatingBars>
            {[1, 2, 3, 4, 5].map((star) => {
              const count = ratingDist.map.get(star) ?? 0;
              const pct = ratingDist.total > 0 ? Math.round((count / ratingDist.total) * 100) : 0;
              return (
                <RatingBarRow key={star}>
                  <RatingBarLabel>{star}★</RatingBarLabel>
                  <RatingBarTrack>
                    <RatingBarFill $width={pct} />
                  </RatingBarTrack>
                  <RatingBarValue>
                    <Typography variant="body2">{count}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {pct}%
                    </Typography>
                  </RatingBarValue>
                </RatingBarRow>
              );
            })}
          </RatingBars>
        </ChartCard>
      </ChartRow>
    </AnalyticsRoot>
  );
}
