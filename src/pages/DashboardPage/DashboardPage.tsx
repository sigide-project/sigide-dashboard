import AssignmentOutlined from '@mui/icons-material/AssignmentOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import FlagOutlined from '@mui/icons-material/FlagOutlined';
import HourglassEmptyOutlined from '@mui/icons-material/HourglassEmptyOutlined';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import RadioButtonUncheckedOutlined from '@mui/icons-material/RadioButtonUncheckedOutlined';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import StarOutlined from '@mui/icons-material/StarOutlined';
import Rating from '@mui/material/Rating';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ToggleButton from '@mui/material/ToggleButton';
import { useQuery } from '@tanstack/react-query';
import type { CSSProperties } from 'react';
import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { LoadingSpinner, PageHeader, StatCard, StatusBadge } from '@/components';
import { analyticsService, feedbackService, reportsService } from '@/services';
import type { AdminStats, AnalyticsData, Feedback, Report } from '@/types';
import { formatDate } from '@/utils';
import {
  ChartCard,
  ChartRow,
  ChartTitle,
  DashboardRoot,
  FeedbackAuthor,
  FeedbackMeta,
  FeedbackPreview,
  FeedbackRow,
  PeriodToggle,
  StatsGrid,
  TableCard,
  TableCardHeader,
  TableSection,
  TableSectionTitle,
  ViewAllLink,
} from './DashboardPage.styled';

type Period = '7d' | '30d' | '90d' | '1y';

const iconProps = { style: { fontSize: 24 } as const };

function normalizeItemsOverTime(data: AnalyticsData['items_over_time']) {
  return data.map((row) => ({
    date: row.date,
    lost: Number(row.lost),
    found: Number(row.found),
    resolved: Number(row.resolved),
  }));
}

export function DashboardPage() {
  const [period, setPeriod] = useState<Period>('30d');

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => analyticsService.getStats() as Promise<AdminStats>,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['admin', 'analytics', period],
    queryFn: () => analyticsService.getAnalytics(period),
  });

  const { data: reportsPage } = useQuery({
    queryKey: ['admin', 'reports', 'recent'],
    queryFn: () =>
      reportsService.getAll({ page: 1, limit: 5, sort: 'created_at', order: 'desc' }) as Promise<{
        reports: Report[];
      }>,
  });

  const { data: feedbackPage } = useQuery({
    queryKey: ['admin', 'feedback', 'recent'],
    queryFn: () =>
      feedbackService.getAll({ page: 1, limit: 5, sort: 'created_at', order: 'desc' }) as Promise<{
        feedback: Feedback[];
      }>,
  });

  const itemsSeries = useMemo(
    () => normalizeItemsOverTime(analytics?.items_over_time ?? []),
    [analytics?.items_over_time],
  );

  const topCategories = useMemo(
    () =>
      (analytics?.top_categories ?? []).map((row) => ({
        category: row.category,
        count: Number(row.count),
      })),
    [analytics?.top_categories],
  );

  const recentReports = reportsPage?.reports?.slice(0, 5) ?? [];
  const recentFeedback = feedbackPage?.feedback?.slice(0, 5) ?? [];

  const avgRating = analytics?.feedback_avg_rating ?? 0;
  const avgRatingDisplay = Number.isFinite(avgRating) ? avgRating.toFixed(1) : '0.0';

  const chartFlexStyle = (flex: string): CSSProperties => ({ ['--flex' as string]: flex });

  if (statsLoading || analyticsLoading || !stats) {
    return <LoadingSpinner />;
  }

  const s = stats;

  return (
    <DashboardRoot>
      <PageHeader title="Dashboard" />
      <StatsGrid>
        <StatCard
          title="Total users"
          value={s.total_users}
          icon={<PeopleOutlined {...iconProps} />}
          color="#3B82F6"
        />
        <StatCard
          title="Total items"
          value={s.total_items}
          icon={<SearchOutlined {...iconProps} />}
          color="#7C3AED"
        />
        <StatCard
          title="Open items"
          value={s.open_items}
          icon={<RadioButtonUncheckedOutlined {...iconProps} />}
          color="#F59E0B"
        />
        <StatCard
          title="Resolved items"
          value={s.resolved_items}
          icon={<CheckCircleOutlined {...iconProps} />}
          color="#10B981"
        />
        <StatCard
          title="Total claims"
          value={s.total_claims}
          icon={<AssignmentOutlined {...iconProps} />}
          color="#3B82F6"
        />
        <StatCard
          title="Pending claims"
          value={s.pending_claims}
          icon={<HourglassEmptyOutlined {...iconProps} />}
          color="#F59E0B"
        />
        <StatCard
          title="Open reports"
          value={s.open_reports}
          icon={<FlagOutlined {...iconProps} />}
          color="#EF4444"
        />
        <StatCard
          title="Avg rating"
          value={avgRatingDisplay}
          icon={<StarOutlined {...iconProps} />}
          color="#F59E0B"
        />
      </StatsGrid>

      <ChartRow>
        <ChartCard style={chartFlexStyle('3')}>
          <ChartTitle>Items over time</ChartTitle>
          <PeriodToggle
            exclusive
            value={period}
            onChange={(_, v) => {
              if (v) setPeriod(v as Period);
            }}
            size="small"
            color="primary"
          >
            <ToggleButton value="7d">7d</ToggleButton>
            <ToggleButton value="30d">30d</ToggleButton>
            <ToggleButton value="90d">90d</ToggleButton>
            <ToggleButton value="1y">1y</ToggleButton>
          </PeriodToggle>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={itemsSeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="lost"
                stackId="1"
                stroke="#EF4444"
                fill="#EF4444"
                fillOpacity={0.35}
              />
              <Area
                type="monotone"
                dataKey="found"
                stackId="1"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.35}
              />
              <Area
                type="monotone"
                dataKey="resolved"
                stackId="1"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.35}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard style={chartFlexStyle('2')}>
          <ChartTitle>Top categories</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              layout="vertical"
              data={topCategories}
              margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="category" type="category" width={100} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#7C3AED" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartRow>

      <TableSection>
        <TableCard>
          <TableCardHeader>
            <TableSectionTitle>Recent reports</TableSectionTitle>
            <ViewAllLink to="/reports">View all</ViewAllLink>
          </TableCardHeader>
          {recentReports.length > 0 ? (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Issue type</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentReports.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.issue_type}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{formatDate(row.createdAt)}</TableCell>
                    <TableCell>
                      <StatusBadge status={row.status} type="report" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
        </TableCard>
        <TableCard>
          <TableCardHeader>
            <TableSectionTitle>Recent feedback</TableSectionTitle>
            <ViewAllLink to="/feedback">View all</ViewAllLink>
          </TableCardHeader>
          {recentFeedback.length > 0
            ? recentFeedback.map((f) => (
                <FeedbackRow key={f.id}>
                  <Rating value={f.rating ?? 0} readOnly size="small" />
                  <FeedbackAuthor>{f.name?.trim() || 'Anonymous'}</FeedbackAuthor>
                  <FeedbackPreview>
                    {f.feedback.length > 60 ? `${f.feedback.slice(0, 60)}…` : f.feedback}
                  </FeedbackPreview>
                  <FeedbackMeta>{formatDate(f.createdAt)}</FeedbackMeta>
                </FeedbackRow>
              ))
            : null}
        </TableCard>
      </TableSection>
    </DashboardRoot>
  );
}
