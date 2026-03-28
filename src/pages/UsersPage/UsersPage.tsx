import AdminPanelSettingsOutlined from '@mui/icons-material/AdminPanelSettingsOutlined';
import BlockOutlined from '@mui/icons-material/BlockOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
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
import { usersService } from '@/services';
import type { Column, User } from '@/types';
import { exportToCsv, formatDate, getInitials } from '@/utils';
import {
  ActionsCell,
  FilterSelect,
  FiltersBar,
  SearchField,
  UserAvatar,
  UserCell,
  UserLink,
  UsersRoot,
} from './UsersPage.styled';

type RoleFilter = '' | 'user' | 'admin' | 'banned';
type SortOption = 'newest' | 'oldest' | 'highest_rated';

interface UsersListData {
  users: User[];
  total: number;
  page: number;
  pages: number;
}

function sortApiParams(sort: SortOption): { sort: string; order: 'asc' | 'desc' } {
  if (sort === 'oldest') {
    return { sort: 'created_at', order: 'asc' };
  }
  if (sort === 'highest_rated') {
    return { sort: 'rating', order: 'desc' };
  }
  return { sort: 'created_at', order: 'desc' };
}

export function UsersPage() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [role, setRole] = useState<RoleFilter>('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [banTarget, setBanTarget] = useState<User | null>(null);
  const [adminTarget, setAdminTarget] = useState<User | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(search), 400);
    return () => window.clearTimeout(t);
  }, [search]);

  const sortParams = useMemo(() => sortApiParams(sort), [sort]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['admin', 'users', page, rowsPerPage, debouncedSearch, role, sort],
    queryFn: () =>
      usersService.getAll({
        page: page + 1,
        limit: rowsPerPage,
        search: debouncedSearch.trim() || undefined,
        role: role || undefined,
        sort: sortParams.sort,
        order: sortParams.order,
      }) as Promise<UsersListData>,
  });

  const banMutation = useMutation({
    mutationFn: (id: string) => usersService.ban(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      showSnackbar('User banned', 'success');
      setBanTarget(null);
    },
    onError: () => showSnackbar('Failed to ban user', 'error'),
  });

  const unbanMutation = useMutation({
    mutationFn: (id: string) => usersService.unban(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      showSnackbar('User unbanned', 'success');
      setBanTarget(null);
    },
    onError: () => showSnackbar('Failed to unban user', 'error'),
  });

  const makeAdminMutation = useMutation({
    mutationFn: (id: string) => usersService.makeAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      showSnackbar('User is now an admin', 'success');
      setAdminTarget(null);
    },
    onError: () => showSnackbar('Failed to update role', 'error'),
  });

  const rows = data?.users ?? [];
  const total = data?.total ?? 0;
  const tableLoading = isLoading || isFetching;

  const exportUsers = () => {
    exportToCsv(
      'users',
      rows.map((u) => ({
        name: u.name,
        email: u.email,
        role: u.role,
        rating: Number(u.rating),
        items_count: u.items_count ?? 0,
        joined: formatDate(u.createdAt),
      })),
    );
  };

  const columns: Column<User>[] = useMemo(
    () => [
      {
        key: 'name',
        label: 'User',
        render: (u) => (
          <UserCell>
            <UserAvatar src={u.avatar_url ?? undefined}>{getInitials(u.name)}</UserAvatar>
            <UserLink to={`/users/${u.id}`}>{u.name}</UserLink>
          </UserCell>
        ),
      },
      { key: 'email', label: 'Email' },
      {
        key: 'role',
        label: 'Role',
        render: (u) => <StatusBadge status={u.role} type="user" />,
      },
      {
        key: 'rating',
        label: 'Rating',
        render: (u) => (
          <Typography variant="body2" component="span">
            ★ {Number(u.rating).toFixed(1)}
          </Typography>
        ),
      },
      {
        key: 'items_count',
        label: 'Items',
        render: (u) => String(u.items_count ?? 0),
      },
      {
        key: 'createdAt',
        label: 'Joined',
        render: (u) => formatDate(u.createdAt),
      },
      {
        key: 'actions',
        label: 'Actions',
        width: 200,
        render: (u) => (
          <ActionsCell>
            <IconButton component={Link} to={`/users/${u.id}`} size="small" aria-label="View user">
              <VisibilityOutlined fontSize="small" />
            </IconButton>
            {u.role !== 'admin' ? (
              u.role === 'banned' ? (
                <IconButton
                  size="small"
                  aria-label="Unban user"
                  onClick={() => setBanTarget(u)}
                  color="primary"
                >
                  <CheckCircleOutlined fontSize="small" />
                </IconButton>
              ) : (
                <IconButton
                  size="small"
                  aria-label="Ban user"
                  onClick={() => setBanTarget(u)}
                  color="error"
                >
                  <BlockOutlined fontSize="small" />
                </IconButton>
              )
            ) : null}
            {u.role !== 'admin' ? (
              <IconButton
                size="small"
                aria-label="Make admin"
                onClick={() => setAdminTarget(u)}
                color="primary"
              >
                <AdminPanelSettingsOutlined fontSize="small" />
              </IconButton>
            ) : null}
          </ActionsCell>
        ),
      },
    ],
    [],
  );

  const banBusy = banMutation.isPending || unbanMutation.isPending;
  const adminBusy = makeAdminMutation.isPending;

  const handleConfirmBan = () => {
    if (!banTarget) {
      return;
    }
    if (banTarget.role === 'banned') {
      unbanMutation.mutate(banTarget.id);
    } else {
      banMutation.mutate(banTarget.id);
    }
  };

  if (isLoading && !data) {
    return <LoadingSpinner />;
  }

  return (
    <UsersRoot>
      <PageHeader
        title="Users"
        action={{
          label: 'Export CSV',
          icon: <FileDownloadOutlined />,
          onClick: exportUsers,
        }}
      />
      <FiltersBar>
        <SearchField
          placeholder="Search by name or email"
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
          <InputLabel id="users-role-filter">Role</InputLabel>
          <Select
            labelId="users-role-filter"
            label="Role"
            value={role}
            onChange={(e) => {
              setRole(e.target.value as RoleFilter);
              setPage(0);
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="banned">Banned</MenuItem>
          </Select>
        </FilterSelect>
        <FilterSelect size="small">
          <InputLabel id="users-sort-filter">Sort</InputLabel>
          <Select<SortOption>
            labelId="users-sort-filter"
            label="Sort"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as SortOption);
              setPage(0);
            }}
          >
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
            <MenuItem value="highest_rated">Highest rated</MenuItem>
          </Select>
        </FilterSelect>
      </FiltersBar>

      <DataTable<User>
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
        open={Boolean(banTarget)}
        title={banTarget?.role === 'banned' ? 'Unban user' : 'Ban user'}
        description={
          banTarget?.role === 'banned'
            ? `Allow ${banTarget.name} to use the platform again?`
            : `Ban ${banTarget?.name ?? ''}? They will not be able to sign in.`
        }
        confirmLabel={banTarget?.role === 'banned' ? 'Unban' : 'Ban'}
        confirmColor={banTarget?.role === 'banned' ? 'primary' : 'error'}
        onConfirm={handleConfirmBan}
        onCancel={() => setBanTarget(null)}
        isLoading={banBusy}
      />

      <ConfirmDialog
        open={Boolean(adminTarget)}
        title="Make admin"
        description={`Grant admin access to ${adminTarget?.name ?? ''}?`}
        confirmLabel="Make admin"
        onConfirm={() => adminTarget && makeAdminMutation.mutate(adminTarget.id)}
        onCancel={() => setAdminTarget(null)}
        isLoading={adminBusy}
      />
    </UsersRoot>
  );
}
