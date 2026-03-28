import ExpandLessOutlined from '@mui/icons-material/ExpandLessOutlined';
import ExpandMoreOutlined from '@mui/icons-material/ExpandMoreOutlined';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Rating from '@mui/material/Rating';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { isAxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import type { MouseEvent } from 'react';
import { Fragment, useMemo, useState } from 'react';
import {
  BodyCell,
  BodyRow,
  HeaderCell,
  HeaderRow,
  LoadingOverlay,
  StyledTable,
  TableWrapper,
} from '@/components/DataTable/DataTable.styled';
import { EmptyState, LoadingSpinner, PageHeader } from '@/components';
import { analyticsService, feedbackService } from '@/services';
import type { Feedback } from '@/types';
import { exportToCsv, formatDate } from '@/utils';
import {
  ActionsCell,
  AvgRatingBlock,
  ExpandedFeedback,
  FeedbackPreviewCell,
  FeedbackRoot,
  FilterSelect,
  FiltersBar,
  RatingBarCount,
  RatingBarFill,
  RatingBarLabel,
  RatingBarRow,
  RatingBars,
  RatingBarTrack,
  SummaryBar,
  SummaryLabel,
  SummaryMetric,
  SummaryStarIcon,
  SummaryValue,
} from './FeedbackPage.styled';

const STAR_COLORS: Record<number, string> = {
  5: '#10b981',
  4: '#3b82f6',
  3: '#f59e0b',
  2: '#f97316',
  1: '#ef4444',
};

type SortOption = 'newest' | 'highest' | 'lowest';

interface FeedbackListData {
  feedback: Feedback[];
  total: number;
  page: number;
  pages: number;
}

function sortApiParams(sort: SortOption): { sort: string; order: 'asc' | 'desc' } {
  if (sort === 'highest') {
    return { sort: 'rating', order: 'desc' };
  }
  if (sort === 'lowest') {
    return { sort: 'rating', order: 'asc' };
  }
  return { sort: 'created_at', order: 'desc' };
}

const COL_COUNT = 6;

export function FeedbackPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [minRating, setMinRating] = useState<number>(1);
  const [sort, setSort] = useState<SortOption>('newest');
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

  const sp = useMemo(() => sortApiParams(sort), [sort]);

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['admin', 'analytics', 'feedback-summary'],
    queryFn: () => analyticsService.getAnalytics('30d'),
  });

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ['admin', 'feedback', page, rowsPerPage, minRating, sort],
    queryFn: () =>
      feedbackService.getAll({
        page: page + 1,
        limit: rowsPerPage,
        min_rating: minRating,
        sort: sp.sort,
        order: sp.order,
      }) as Promise<FeedbackListData>,
  });

  const rows = data?.feedback ?? [];
  const total = data?.total ?? 0;
  const tableLoading = isLoading || isFetching;

  const distribution = useMemo(() => {
    const list = analytics?.rating_distribution ?? [];
    const map = new Map(list.map((r) => [r.rating, r.count]));
    const sum = list.reduce((acc, r) => acc + r.count, 0);
    return { map, sum };
  }, [analytics?.rating_distribution]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const exportFeedback = () => {
    exportToCsv(
      'feedback',
      rows.map((f) => ({
        rating: f.rating ?? '',
        name: f.name ?? 'Anonymous',
        email: f.email ?? '',
        feedback: f.feedback,
        submitted: formatDate(f.createdAt),
      })),
    );
  };

  const handlePageChange = (_: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(0);
  };

  if (isLoading && !data) {
    return <LoadingSpinner />;
  }

  if (isError) {
    const msg = isAxiosError(error) ? error.message : 'Failed to load feedback';
    return (
      <FeedbackRoot>
        <PageHeader title="Feedback" />
        <Typography color="error">{msg}</Typography>
      </FeedbackRoot>
    );
  }

  const showEmpty = !tableLoading && rows.length === 0;
  const avg = analytics?.feedback_avg_rating ?? 0;

  return (
    <FeedbackRoot>
      <PageHeader
        title="Feedback"
        action={{
          label: 'Export CSV',
          icon: <FileDownloadOutlined />,
          onClick: exportFeedback,
        }}
      />

      <SummaryBar variant="outlined">
        <SummaryMetric>
          <SummaryLabel>Average rating</SummaryLabel>
          <AvgRatingBlock>
            {analyticsLoading ? (
              <CircularProgress size={28} />
            ) : (
              <>
                <SummaryStarIcon />
                <SummaryValue>{avg.toFixed(1)}</SummaryValue>
              </>
            )}
          </AvgRatingBlock>
        </SummaryMetric>
        <SummaryMetric>
          <SummaryLabel>Total submissions</SummaryLabel>
          <SummaryValue>{total}</SummaryValue>
        </SummaryMetric>
        <RatingBars>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution.map.get(star) ?? 0;
            const pct = distribution.sum > 0 ? Math.round((count / distribution.sum) * 100) : 0;
            return (
              <RatingBarRow key={star}>
                <RatingBarLabel>{star}★</RatingBarLabel>
                <RatingBarTrack>
                  <RatingBarFill $width={pct} $color={STAR_COLORS[star]} />
                </RatingBarTrack>
                <RatingBarCount>{pct}%</RatingBarCount>
              </RatingBarRow>
            );
          })}
        </RatingBars>
      </SummaryBar>

      <FiltersBar>
        <Box minWidth={200}>
          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            Min rating: {minRating}
          </Typography>
          <Slider
            value={minRating}
            onChange={(_, v) => {
              setMinRating(v as number);
              setPage(0);
            }}
            min={1}
            max={5}
            step={1}
            marks
            valueLabelDisplay="auto"
          />
        </Box>
        <FilterSelect size="small">
          <InputLabel id="feedback-sort-filter">Sort</InputLabel>
          <Select
            labelId="feedback-sort-filter"
            label="Sort"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as SortOption);
              setPage(0);
            }}
          >
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="highest">Highest</MenuItem>
            <MenuItem value="lowest">Lowest</MenuItem>
          </Select>
        </FilterSelect>
      </FiltersBar>

      <Paper variant="outlined">
        <TableWrapper>
          {tableLoading ? (
            <LoadingOverlay>
              <CircularProgress color="primary" />
            </LoadingOverlay>
          ) : null}
          {showEmpty ? (
            <EmptyState message="No feedback yet" />
          ) : (
            <TableContainer>
              <StyledTable stickyHeader size="medium">
                <TableHead>
                  <HeaderRow>
                    <HeaderCell>Rating</HeaderCell>
                    <HeaderCell>Name</HeaderCell>
                    <HeaderCell>Email</HeaderCell>
                    <HeaderCell>Feedback</HeaderCell>
                    <HeaderCell>Submitted</HeaderCell>
                    <HeaderCell $width={100}>Actions</HeaderCell>
                  </HeaderRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <Fragment key={row.id}>
                      <BodyRow>
                        <BodyCell>
                          <Rating value={row.rating ?? 0} readOnly size="small" precision={0.5} />
                        </BodyCell>
                        <BodyCell>{row.name?.trim() ? row.name : 'Anonymous'}</BodyCell>
                        <BodyCell>{row.email?.trim() ? row.email : '—'}</BodyCell>
                        <BodyCell>
                          <FeedbackPreviewCell>
                            {row.feedback.length > 100
                              ? `${row.feedback.slice(0, 100)}…`
                              : row.feedback}
                          </FeedbackPreviewCell>
                        </BodyCell>
                        <BodyCell>{formatDate(row.createdAt)}</BodyCell>
                        <BodyCell $width={100}>
                          <ActionsCell>
                            <IconButton
                              size="small"
                              aria-label={expanded.has(row.id) ? 'Collapse' : 'Expand'}
                              onClick={() => toggleExpand(row.id)}
                            >
                              {expanded.has(row.id) ? (
                                <ExpandLessOutlined fontSize="small" />
                              ) : (
                                <ExpandMoreOutlined fontSize="small" />
                              )}
                            </IconButton>
                          </ActionsCell>
                        </BodyCell>
                      </BodyRow>
                      {expanded.has(row.id) ? (
                        <TableRow key={`${row.id}-exp`}>
                          <TableCell colSpan={COL_COUNT}>
                            <ExpandedFeedback>
                              <Typography variant="body2" color="text.secondary">
                                {row.feedback}
                              </Typography>
                            </ExpandedFeedback>
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </Fragment>
                  ))}
                </TableBody>
              </StyledTable>
            </TableContainer>
          )}
          {!showEmpty ? (
            <TablePagination
              component="div"
              count={total}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          ) : null}
        </TableWrapper>
      </Paper>
    </FeedbackRoot>
  );
}
