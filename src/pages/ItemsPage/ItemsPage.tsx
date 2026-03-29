import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ConfirmDialog,
  DataTable,
  LoadingSpinner,
  PageHeader,
  StatusBadge,
  useSnackbar,
} from '@/components';
import { itemsService } from '@/services';
import type { Column, Item } from '@/types';
import { exportToCsv, formatDate } from '@/utils';
import {
  ActionsCell,
  FilterSelect,
  FiltersBar,
  ItemLink,
  ItemsRoot,
  OwnerLink,
  SearchField,
  ThumbnailImg,
  ThumbnailPlaceholder,
} from './ItemsPage.styled';

const CATEGORY_OPTIONS: { label: string; value: string }[] = [
  { label: 'Electronics', value: 'electronics' },
  { label: 'Documents', value: 'documents' },
  { label: 'Keys', value: 'keys' },
  { label: 'Wallets', value: 'wallet' },
  { label: 'Bags', value: 'bags' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Jewelry', value: 'jewelry' },
  { label: 'Pets', value: 'pets' },
  { label: 'Other', value: 'other' },
];

type TypeFilter = '' | 'lost' | 'found';
type StatusFilter = '' | 'open' | 'claimed' | 'resolved';
type SortOption = 'newest' | 'oldest' | 'highest_reward';

interface ItemsListData {
  items: Item[];
  total: number;
  page: number;
  pages: number;
}

function sortApiParams(sort: SortOption): { sort: string; order: 'asc' | 'desc' } {
  if (sort === 'oldest') {
    return { sort: 'created_at', order: 'asc' };
  }
  if (sort === 'highest_reward') {
    return { sort: 'reward_amount', order: 'desc' };
  }
  return { sort: 'created_at', order: 'desc' };
}

function formatReward(amount: number): string {
  if (!amount || Number(amount) <= 0) {
    return '—';
  }
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

export function ItemsPage() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [type, setType] = useState<TypeFilter>('');
  const [status, setStatus] = useState<StatusFilter>('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
  const [statusChange, setStatusChange] = useState<{ item: Item; next: Item['status'] } | null>(
    null,
  );

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(search), 400);
    return () => window.clearTimeout(t);
  }, [search]);

  const sortParams = useMemo(() => sortApiParams(sort), [sort]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['admin', 'items', page, rowsPerPage, debouncedSearch, type, status, category, sort],
    queryFn: () =>
      itemsService.getAll({
        page: page + 1,
        limit: rowsPerPage,
        search: debouncedSearch.trim() || undefined,
        type: type || undefined,
        status: status || undefined,
        category: category || undefined,
        sort: sortParams.sort,
        order: sortParams.order,
      }) as Promise<ItemsListData>,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, next }: { id: string; next: Item['status'] }) =>
      itemsService.updateStatus(id, next),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'items'] });
      showSnackbar('Status updated', 'success');
      setStatusChange(null);
    },
    onError: () => showSnackbar('Failed to update status', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => itemsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'items'] });
      showSnackbar('Item deleted', 'success');
      setDeleteTarget(null);
    },
    onError: () => showSnackbar('Failed to delete item', 'error'),
  });

  const rows = data?.items ?? [];
  const total = data?.total ?? 0;
  const tableLoading = isLoading || isFetching;

  const exportItems = () => {
    exportToCsv(
      'items',
      rows.map((item) => ({
        title: item.title,
        type: item.type,
        status: item.status,
        category: item.category ?? '',
        owner: item.owner?.name ?? '',
        reward: item.reward_amount,
        created: formatDate(item.createdAt),
      })),
    );
  };

  const columns: Column<Item>[] = useMemo(
    () => [
      {
        key: 'thumb',
        label: '',
        width: 56,
        render: (row) => {
          const url = row.image_urls?.[0];
          return url ? (
            <ThumbnailImg src={url} alt="" />
          ) : (
            <ThumbnailPlaceholder>
              <VisibilityOutlined fontSize="small" />
            </ThumbnailPlaceholder>
          );
        },
      },
      {
        key: 'title',
        label: 'Title',
        render: (row) => <ItemLink to={`/items/${row.id}`}>{row.title}</ItemLink>,
      },
      {
        key: 'type',
        label: 'Type',
        render: (row) => (
          <Chip
            label={row.type === 'lost' ? 'LOST' : 'FOUND'}
            size="small"
            color={row.type === 'lost' ? 'error' : 'success'}
          />
        ),
      },
      {
        key: 'status',
        label: 'Status',
        render: (row) => <StatusBadge status={row.status} type="item" />,
      },
      {
        key: 'category',
        label: 'Category',
        render: (row) => row.category ?? '—',
      },
      {
        key: 'owner',
        label: 'Owner',
        render: (row) =>
          row.owner ? <OwnerLink to={`/users/${row.owner.id}`}>{row.owner.name}</OwnerLink> : '—',
      },
      {
        key: 'reward_amount',
        label: 'Reward',
        render: (row) => formatReward(Number(row.reward_amount)),
      },
      {
        key: 'createdAt',
        label: 'Created',
        render: (row) => formatDate(row.createdAt),
      },
      {
        key: 'actions',
        label: 'Actions',
        width: 220,
        render: (row) => (
          <ActionsCell>
            <IconButton
              component={Link}
              to={`/items/${row.id}`}
              size="small"
              aria-label="View item"
            >
              <VisibilityOutlined fontSize="small" />
            </IconButton>
            <FormControl size="small" variant="outlined" sx={{ minWidth: 120 }}>
              <Select
                value={row.status}
                onChange={(e) => {
                  const next = e.target.value as Item['status'];
                  if (next !== row.status) {
                    setStatusChange({ item: row, next });
                  }
                }}
              >
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="claimed">Claimed</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            <IconButton
              size="small"
              color="error"
              aria-label="Delete item"
              onClick={() => setDeleteTarget(row)}
            >
              <DeleteOutlined fontSize="small" />
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

  return (
    <ItemsRoot>
      <PageHeader
        title="Items"
        action={{
          label: 'Export CSV',
          icon: <FileDownloadOutlined />,
          onClick: exportItems,
        }}
      />
      <FiltersBar>
        <SearchField
          placeholder="Search items"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <FilterSelect size="small">
          <InputLabel id="items-type-filter">Type</InputLabel>
          <Select
            labelId="items-type-filter"
            label="Type"
            value={type}
            onChange={(e) => {
              setType(e.target.value as TypeFilter);
              setPage(0);
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="lost">Lost</MenuItem>
            <MenuItem value="found">Found</MenuItem>
          </Select>
        </FilterSelect>
        <FilterSelect size="small">
          <InputLabel id="items-status-filter">Status</InputLabel>
          <Select
            labelId="items-status-filter"
            label="Status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as StatusFilter);
              setPage(0);
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="claimed">Claimed</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
          </Select>
        </FilterSelect>
        <FilterSelect size="small">
          <InputLabel id="items-category-filter">Category</InputLabel>
          <Select
            labelId="items-category-filter"
            label="Category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(0);
            }}
          >
            <MenuItem value="">All</MenuItem>
            {CATEGORY_OPTIONS.map((c) => (
              <MenuItem key={c.value} value={c.value}>
                {c.label}
              </MenuItem>
            ))}
          </Select>
        </FilterSelect>
        <FilterSelect size="small">
          <InputLabel id="items-sort-filter">Sort</InputLabel>
          <Select
            labelId="items-sort-filter"
            label="Sort"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as SortOption);
              setPage(0);
            }}
          >
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
            <MenuItem value="highest_reward">Highest reward</MenuItem>
          </Select>
        </FilterSelect>
      </FiltersBar>

      <DataTable<Item>
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

      <ConfirmDialog
        open={Boolean(statusChange)}
        title="Change item status"
        description={`Set status to ${statusChange?.next ?? ''}?`}
        confirmLabel="Update"
        onConfirm={() => {
          if (statusChange) {
            updateStatusMutation.mutate({ id: statusChange.item.id, next: statusChange.next });
          }
        }}
        onCancel={() => setStatusChange(null)}
        isLoading={updateStatusMutation.isPending}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete item"
        description="Delete this item? All claims and messages will also be deleted."
        confirmLabel="Delete"
        confirmColor="error"
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteMutation.isPending}
      />
    </ItemsRoot>
  );
}
