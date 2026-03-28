import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { isAxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataTable, LoadingSpinner, PageHeader, StatusBadge } from '@/components';
import { claimsService } from '@/services';
import type { Claim, Column } from '@/types';
import { formatDate } from '@/utils';
import {
  ActionsCell,
  ClaimsRoot,
  FilterSelect,
  FiltersBar,
  ItemLink,
  UserLink,
} from './ClaimsPage.styled';

type StatusFilter = '' | 'pending' | 'accepted' | 'rejected' | 'resolved';
type SortField = 'created_at' | 'updated_at';
type Order = 'asc' | 'desc';

interface ClaimsListData {
  claims: Claim[];
  total: number;
  page: number;
  pages: number;
}

export function ClaimsPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [status, setStatus] = useState<StatusFilter>('');
  const [sort, setSort] = useState<SortField>('created_at');
  const [order, setOrder] = useState<Order>('desc');

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ['admin', 'claims', page, rowsPerPage, status, sort, order],
    queryFn: () =>
      claimsService.getAll({
        page: page + 1,
        limit: rowsPerPage,
        status: status || undefined,
        sort,
        order,
      }) as Promise<ClaimsListData>,
  });

  const rows = data?.claims ?? [];
  const total = data?.total ?? 0;
  const tableLoading = isLoading || isFetching;

  const columns: Column<Claim>[] = useMemo(
    () => [
      {
        key: 'title',
        label: 'Item title',
        render: (row) =>
          row.item ? <ItemLink to={`/items/${row.item_id}`}>{row.item.title}</ItemLink> : '—',
      },
      {
        key: 'type',
        label: 'Type',
        render: (row) =>
          row.item ? (
            <Chip
              label={row.item.type === 'lost' ? 'LOST' : 'FOUND'}
              size="small"
              color={row.item.type === 'lost' ? 'error' : 'success'}
            />
          ) : (
            '—'
          ),
      },
      {
        key: 'claimant',
        label: 'Claimant',
        render: (row) =>
          row.claimant ? (
            <UserLink to={`/users/${row.claimant_id}`}>{row.claimant.name}</UserLink>
          ) : (
            '—'
          ),
      },
      {
        key: 'owner',
        label: 'Owner',
        render: (row) => {
          const o =
            row.owner ??
            (row.item && 'owner' in row.item
              ? (row.item as { owner?: { id: string; name: string } }).owner
              : undefined);
          return o ? <UserLink to={`/users/${o.id}`}>{o.name}</UserLink> : '—';
        },
      },
      {
        key: 'status',
        label: 'Status',
        render: (row) => <StatusBadge status={row.status} type="claim" />,
      },
      {
        key: 'createdAt',
        label: 'Submitted',
        render: (row) => formatDate(row.createdAt),
      },
      {
        key: 'actions',
        label: 'Actions',
        width: 80,
        render: (row) => (
          <ActionsCell>
            <IconButton
              component={Link}
              to={`/claims/${row.id}`}
              size="small"
              aria-label="View claim"
            >
              <VisibilityOutlined fontSize="small" />
            </IconButton>
          </ActionsCell>
        ),
      },
    ],
    [],
  );

  if (isLoading && !data) {
    return <LoadingSpinner />;
  }

  if (isError) {
    const msg = isAxiosError(error) ? error.message : 'Failed to load claims';
    return (
      <ClaimsRoot>
        <PageHeader title="Claims" />
        <Typography color="error">{msg}</Typography>
      </ClaimsRoot>
    );
  }

  return (
    <ClaimsRoot>
      <PageHeader title="Claims" />
      <FiltersBar>
        <FilterSelect size="small">
          <InputLabel id="claims-status-filter">Status</InputLabel>
          <Select
            labelId="claims-status-filter"
            label="Status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as StatusFilter);
              setPage(0);
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="accepted">Accepted</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
          </Select>
        </FilterSelect>
        <FilterSelect size="small">
          <InputLabel id="claims-sort-filter">Sort</InputLabel>
          <Select
            labelId="claims-sort-filter"
            label="Sort"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as SortField);
              setPage(0);
            }}
          >
            <MenuItem value="created_at">Submitted</MenuItem>
            <MenuItem value="updated_at">Last updated</MenuItem>
          </Select>
        </FilterSelect>
        <FilterSelect size="small">
          <InputLabel id="claims-order-filter">Order</InputLabel>
          <Select
            labelId="claims-order-filter"
            label="Order"
            value={order}
            onChange={(e) => {
              setOrder(e.target.value as Order);
              setPage(0);
            }}
          >
            <MenuItem value="desc">Newest first</MenuItem>
            <MenuItem value="asc">Oldest first</MenuItem>
          </Select>
        </FilterSelect>
      </FiltersBar>

      <DataTable<Claim>
        columns={columns}
        rows={rows}
        isLoading={tableLoading}
        total={total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={(n) => {
          setRowsPerPage(n);
          setPage(0);
        }}
      />
    </ClaimsRoot>
  );
}
