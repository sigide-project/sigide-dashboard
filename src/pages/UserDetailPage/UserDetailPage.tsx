import AdminPanelSettingsOutlined from '@mui/icons-material/AdminPanelSettingsOutlined';
import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined';
import BlockOutlined from '@mui/icons-material/BlockOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Rating from '@mui/material/Rating';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { isAxiosError } from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ConfirmDialog, DataTable, LoadingSpinner, StatusBadge, useSnackbar } from '@/components';
import { useAuthStore } from '@/store';
import { usersService } from '@/services';
import type { Claim, Column, Item, User } from '@/types';
import { formatDate, formatRelativeTime, getInitials } from '@/utils';
import {
  ActionButtons,
  BackButton,
  DetailRoot,
  ErrorActions,
  InfoLabel,
  InfoRow,
  InfoValue,
  LargeAvatar,
  LeftColumn,
  PageHeaderRow,
  PageTitle,
  QuickStatCard,
  QuickStatLabel,
  QuickStats,
  QuickStatValue,
  RightColumn,
  TabPanelBox,
  TableEntityLink,
  TabsCard,
  TwoColumnLayout,
  UserCard,
  UserCardContent,
  UserEmail,
  UserName,
} from './UserDetailPage.styled';

interface AdminUserDetailPayload {
  user: User;
  items: Item[];
  claims: Claim[];
  reports_count: number;
}

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const authUser = useAuthStore((s) => s.user);
  const [tab, setTab] = useState(0);
  const [itemsPage, setItemsPage] = useState(0);
  const [itemsRowsPerPage, setItemsRowsPerPage] = useState(10);
  const [claimsPage, setClaimsPage] = useState(0);
  const [claimsRowsPerPage, setClaimsRowsPerPage] = useState(10);
  const [banTargetOpen, setBanTargetOpen] = useState(false);
  const [adminTargetOpen, setAdminTargetOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'users', id],
    queryFn: () => usersService.getById(id!) as Promise<AdminUserDetailPayload>,
    enabled: Boolean(id),
  });

  const banMutation = useMutation({
    mutationFn: () => usersService.ban(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      showSnackbar('User banned', 'success');
      setBanTargetOpen(false);
    },
    onError: () => showSnackbar('Failed to ban user', 'error'),
  });

  const unbanMutation = useMutation({
    mutationFn: () => usersService.unban(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      showSnackbar('User unbanned', 'success');
      setBanTargetOpen(false);
    },
    onError: () => showSnackbar('Failed to unban user', 'error'),
  });

  const makeAdminMutation = useMutation({
    mutationFn: () => usersService.makeAdmin(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      showSnackbar('User is now an admin', 'success');
      setAdminTargetOpen(false);
    },
    onError: () => showSnackbar('Failed to update role', 'error'),
  });

  const user = data?.user;
  const items = data?.items ?? [];
  const claims = data?.claims ?? [];
  const reportsCount = data?.reports_count ?? 0;

  const itemsSlice = useMemo(() => {
    const start = itemsPage * itemsRowsPerPage;
    return items.slice(start, start + itemsRowsPerPage);
  }, [items, itemsPage, itemsRowsPerPage]);

  const claimsSlice = useMemo(() => {
    const start = claimsPage * claimsRowsPerPage;
    return claims.slice(start, start + claimsRowsPerPage);
  }, [claims, claimsPage, claimsRowsPerPage]);

  const itemColumns: Column<Item>[] = useMemo(
    () => [
      {
        key: 'title',
        label: 'Title',
        render: (row) => <TableEntityLink to={`/items/${row.id}`}>{row.title}</TableEntityLink>,
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
        key: 'createdAt',
        label: 'Created',
        render: (row) => formatDate(row.createdAt),
      },
      {
        key: 'actions',
        label: 'Actions',
        width: 100,
        render: (row) => (
          <IconButton component={Link} to={`/items/${row.id}`} size="small" aria-label="View item">
            <VisibilityOutlined fontSize="small" />
          </IconButton>
        ),
      },
    ],
    [],
  );

  const claimColumns: Column<Claim>[] = useMemo(
    () => [
      {
        key: 'item',
        label: 'Item',
        render: (row) => (
          <TableEntityLink to={`/items/${row.item_id}`}>
            {row.item?.title ?? 'Listing'}
          </TableEntityLink>
        ),
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
        width: 100,
        render: (row) => (
          <Button component={Link} to={`/claims/${row.id}`} size="small" variant="text">
            View
          </Button>
        ),
      },
    ],
    [],
  );

  const isSelf = Boolean(authUser && user && authUser.id === user.id);
  const banBusy = banMutation.isPending || unbanMutation.isPending;
  const adminBusy = makeAdminMutation.isPending;

  const handleConfirmBan = () => {
    if (user?.role === 'banned') {
      unbanMutation.mutate();
    } else {
      banMutation.mutate();
    }
  };

  if (!id) {
    return (
      <DetailRoot>
        <Typography>Invalid user id.</Typography>
      </DetailRoot>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !user) {
    const notFound = isAxiosError(error) && error.response?.status === 404;
    return (
      <DetailRoot>
        <Typography variant="h6">{notFound ? 'User not found' : 'Failed to load user'}</Typography>
        <ErrorActions>
          <Button component={Link} to="/users" variant="contained">
            Back to users
          </Button>
        </ErrorActions>
      </DetailRoot>
    );
  }

  return (
    <DetailRoot>
      <PageHeaderRow>
        <BackButton aria-label="Go back" onClick={() => navigate(-1)}>
          <ArrowBackOutlined />
        </BackButton>
        <PageTitle>{user.name}</PageTitle>
      </PageHeaderRow>

      <TwoColumnLayout>
        <LeftColumn>
          <UserCard variant="outlined">
            <UserCardContent>
              <LargeAvatar src={user.avatar_url ?? undefined}>{getInitials(user.name)}</LargeAvatar>
              <UserName>{user.name}</UserName>
              <UserEmail>{user.email}</UserEmail>
              <Box width="100%" marginTop="16px">
                <InfoRow>
                  <InfoLabel>Phone</InfoLabel>
                  <InfoValue>{user.phone ?? '—'}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Role</InfoLabel>
                  <InfoValue>
                    <StatusBadge status={user.role} type="user" />
                  </InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Rating</InfoLabel>
                  <InfoValue>
                    <Rating value={Number(user.rating)} readOnly size="small" precision={0.1} />
                  </InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Joined</InfoLabel>
                  <InfoValue>{formatDate(user.createdAt)}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Member since</InfoLabel>
                  <InfoValue>{formatRelativeTime(user.createdAt)}</InfoValue>
                </InfoRow>
              </Box>
            </UserCardContent>
          </UserCard>

          <QuickStats>
            <QuickStatCard variant="outlined">
              <QuickStatValue>{user.items_count ?? 0}</QuickStatValue>
              <QuickStatLabel>Items</QuickStatLabel>
            </QuickStatCard>
            <QuickStatCard variant="outlined">
              <QuickStatValue>{user.claims_count ?? 0}</QuickStatValue>
              <QuickStatLabel>Claims</QuickStatLabel>
            </QuickStatCard>
            <QuickStatCard variant="outlined">
              <QuickStatValue>{reportsCount}</QuickStatValue>
              <QuickStatLabel>Reports</QuickStatLabel>
            </QuickStatCard>
          </QuickStats>

          {!isSelf && user.role !== 'admin' ? (
            <ActionButtons>
              <Button
                variant="outlined"
                color={user.role === 'banned' ? 'primary' : 'error'}
                startIcon={user.role === 'banned' ? <CheckCircleOutlined /> : <BlockOutlined />}
                onClick={() => setBanTargetOpen(true)}
              >
                {user.role === 'banned' ? 'Unban user' : 'Ban user'}
              </Button>
              <Button
                variant="contained"
                startIcon={<AdminPanelSettingsOutlined />}
                onClick={() => setAdminTargetOpen(true)}
              >
                Make admin
              </Button>
            </ActionButtons>
          ) : null}
        </LeftColumn>

        <RightColumn>
          <TabsCard variant="outlined">
            <Tabs value={tab} onChange={(_, v) => setTab(v)}>
              <Tab label="Items" />
              <Tab label="Claims" />
            </Tabs>
            <Divider />
            <TabPanelBox>
              {tab === 0 ? (
                <DataTable<Item>
                  columns={itemColumns}
                  rows={itemsSlice}
                  isLoading={false}
                  total={items.length}
                  page={itemsPage}
                  rowsPerPage={itemsRowsPerPage}
                  onPageChange={setItemsPage}
                  onRowsPerPageChange={(n) => {
                    setItemsRowsPerPage(n);
                    setItemsPage(0);
                  }}
                  emptyMessage="No items"
                />
              ) : (
                <DataTable<Claim>
                  columns={claimColumns}
                  rows={claimsSlice}
                  isLoading={false}
                  total={claims.length}
                  page={claimsPage}
                  rowsPerPage={claimsRowsPerPage}
                  onPageChange={setClaimsPage}
                  onRowsPerPageChange={(n) => {
                    setClaimsRowsPerPage(n);
                    setClaimsPage(0);
                  }}
                  emptyMessage="No claims"
                />
              )}
            </TabPanelBox>
          </TabsCard>
        </RightColumn>
      </TwoColumnLayout>

      <ConfirmDialog
        open={banTargetOpen}
        title={user.role === 'banned' ? 'Unban user' : 'Ban user'}
        description={
          user.role === 'banned'
            ? `Allow ${user.name} to use the platform again?`
            : `Ban ${user.name}? They will not be able to sign in.`
        }
        confirmLabel={user.role === 'banned' ? 'Unban' : 'Ban'}
        confirmColor={user.role === 'banned' ? 'primary' : 'error'}
        onConfirm={handleConfirmBan}
        onCancel={() => setBanTargetOpen(false)}
        isLoading={banBusy}
      />

      <ConfirmDialog
        open={adminTargetOpen}
        title="Make admin"
        description={`Grant admin access to ${user.name}?`}
        confirmLabel="Make admin"
        onConfirm={() => makeAdminMutation.mutate()}
        onCancel={() => setAdminTargetOpen(false)}
        isLoading={adminBusy}
      />
    </DetailRoot>
  );
}
