import ExpandLessOutlined from '@mui/icons-material/ExpandLessOutlined';
import ExpandMoreOutlined from '@mui/icons-material/ExpandMoreOutlined';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { isAxiosError } from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import {
  ConfirmDialog,
  EmptyState,
  LoadingSpinner,
  PageHeader,
  StatusBadge,
  useSnackbar,
} from '@/components';
import { reportsService } from '@/services';
import type { Report } from '@/types';
import { exportToCsv, formatDate } from '@/utils';
import {
  ActionsCell,
  DescriptionCell,
  ExpandedDescription,
  ExpandedRow,
  FilterSelect,
  FiltersBar,
  IssueTypeChip,
  ListingLink,
  ReportsRoot,
  StatusSelect,
  type IssueTone,
} from './ReportsPage.styled';

const ISSUE_TYPES = [
  'Bug or Technical Issue',
  'Suspicious User/Listing',
  'Inappropriate Content',
  'Scam or Fraud',
  'Account Issue',
  'Other',
] as const;

type SortOption = 'newest' | 'oldest';

interface ReportsListData {
  reports: Report[];
  total: number;
  page: number;
  pages: number;
}

function sortParams(sort: SortOption): { sort: string; order: 'asc' | 'desc' } {
  if (sort === 'oldest') {
    return { sort: 'created_at', order: 'asc' };
  }
  return { sort: 'created_at', order: 'desc' };
}

function issueTone(issueType: string): IssueTone {
  if (issueType.includes('Bug')) return 'bug';
  if (issueType.includes('Suspicious')) return 'suspicious';
  if (issueType.includes('Inappropriate')) return 'inappropriate';
  if (issueType.includes('Scam')) return 'scam';
  if (issueType.includes('Account')) return 'account';
  return 'other';
}

const COL_COUNT = 7;

export function ReportsPage() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [status, setStatus] = useState<'' | Report['status']>('');
  const [issueType, setIssueType] = useState<string>('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const [statusChange, setStatusChange] = useState<{
    report: Report;
    next: Report['status'];
  } | null>(null);

  const sp = useMemo(() => sortParams(sort), [sort]);

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ['admin', 'reports', page, rowsPerPage, status, issueType, sort],
    queryFn: () =>
      reportsService.getAll({
        page: page + 1,
        limit: rowsPerPage,
        status: status || undefined,
        issue_type: issueType || undefined,
        sort: sp.sort,
        order: sp.order,
      }) as Promise<ReportsListData>,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, next }: { id: string; next: Report['status'] }) =>
      reportsService.updateStatus(id, next),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
      showSnackbar('Report status updated', 'success');
      setStatusChange(null);
    },
    onError: () => showSnackbar('Failed to update status', 'error'),
  });

  const rows = data?.reports ?? [];
  const total = data?.total ?? 0;
  const tableLoading = isLoading || isFetching;

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

  const exportReports = () => {
    exportToCsv(
      'reports',
      rows.map((r) => ({
        issue_type: r.issue_type,
        email: r.email,
        listing_url: r.listing_url ?? '',
        description: r.description,
        status: r.status,
        submitted: formatDate(r.createdAt),
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
    const msg = isAxiosError(error) ? error.message : 'Failed to load reports';
    return (
      <ReportsRoot>
        <PageHeader title="Reports" />
        <Typography color="error">{msg}</Typography>
      </ReportsRoot>
    );
  }

  const showEmpty = !tableLoading && rows.length === 0;

  return (
    <ReportsRoot>
      <PageHeader
        title="Reports"
        action={{
          label: 'Export CSV',
          icon: <FileDownloadOutlined />,
          onClick: exportReports,
        }}
      />
      <FiltersBar>
        <FilterSelect size="small">
          <InputLabel id="reports-status-filter">Status</InputLabel>
          <Select
            labelId="reports-status-filter"
            label="Status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as typeof status);
              setPage(0);
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="reviewing">Reviewing</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
            <MenuItem value="dismissed">Dismissed</MenuItem>
          </Select>
        </FilterSelect>
        <FilterSelect size="small">
          <InputLabel id="reports-issue-filter">Issue type</InputLabel>
          <Select
            labelId="reports-issue-filter"
            label="Issue type"
            value={issueType}
            onChange={(e) => {
              setIssueType(e.target.value);
              setPage(0);
            }}
          >
            <MenuItem value="">All</MenuItem>
            {ISSUE_TYPES.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FilterSelect>
        <FilterSelect size="small">
          <InputLabel id="reports-sort-filter">Sort</InputLabel>
          <Select
            labelId="reports-sort-filter"
            label="Sort"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as SortOption);
              setPage(0);
            }}
          >
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
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
            <EmptyState message="No reports" />
          ) : (
            <TableContainer>
              <StyledTable stickyHeader size="medium">
                <TableHead>
                  <HeaderRow>
                    <HeaderCell>Issue type</HeaderCell>
                    <HeaderCell>Email</HeaderCell>
                    <HeaderCell>Listing URL</HeaderCell>
                    <HeaderCell>Description</HeaderCell>
                    <HeaderCell>Status</HeaderCell>
                    <HeaderCell>Submitted</HeaderCell>
                    <HeaderCell $width={220}>Actions</HeaderCell>
                  </HeaderRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <Fragment key={row.id}>
                      <BodyRow>
                        <BodyCell>
                          <IssueTypeChip
                            label={row.issue_type}
                            size="small"
                            $tone={issueTone(row.issue_type)}
                          />
                        </BodyCell>
                        <BodyCell>{row.email}</BodyCell>
                        <BodyCell>
                          {row.listing_url ? (
                            <ListingLink
                              href={row.listing_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {row.listing_url}
                            </ListingLink>
                          ) : (
                            '—'
                          )}
                        </BodyCell>
                        <BodyCell>
                          <DescriptionCell>
                            {row.description.length > 80
                              ? `${row.description.slice(0, 80)}…`
                              : row.description}
                          </DescriptionCell>
                        </BodyCell>
                        <BodyCell>
                          <StatusBadge status={row.status} type="report" />
                        </BodyCell>
                        <BodyCell>{formatDate(row.createdAt)}</BodyCell>
                        <BodyCell $width={220}>
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
                            <FormControl size="small" variant="outlined">
                              <StatusSelect
                                value={row.status}
                                onChange={(e) => {
                                  const next = e.target.value as Report['status'];
                                  if (next !== row.status) {
                                    setStatusChange({ report: row, next });
                                  }
                                }}
                              >
                                <MenuItem value="open">Open</MenuItem>
                                <MenuItem value="reviewing">Reviewing</MenuItem>
                                <MenuItem value="resolved">Resolved</MenuItem>
                                <MenuItem value="dismissed">Dismissed</MenuItem>
                              </StatusSelect>
                            </FormControl>
                          </ActionsCell>
                        </BodyCell>
                      </BodyRow>
                      {expanded.has(row.id) ? (
                        <TableRow key={`${row.id}-exp`}>
                          <TableCell colSpan={COL_COUNT}>
                            <ExpandedRow>
                              <ExpandedDescription>{row.description}</ExpandedDescription>
                            </ExpandedRow>
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

      <ConfirmDialog
        open={Boolean(statusChange)}
        title="Update report status"
        description={`Change status to ${statusChange?.next ?? ''}?`}
        confirmLabel="Update"
        onConfirm={() =>
          statusChange &&
          updateMutation.mutate({ id: statusChange.report.id, next: statusChange.next })
        }
        onCancel={() => setStatusChange(null)}
        isLoading={updateMutation.isPending}
      />
    </ReportsRoot>
  );
}
