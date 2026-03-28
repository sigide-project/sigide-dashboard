import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { isAxiosError } from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ConfirmDialog, EmptyState, LoadingSpinner, StatusBadge, useSnackbar } from '@/components';
import { itemsService } from '@/services';
import type { Claim, Item } from '@/types';
import { formatDate, getInitials } from '@/utils';
import {
  BackButton,
  CenterColumn,
  ClaimAvatar,
  ClaimCard,
  ClaimHeader,
  ClaimMeta,
  DangerDescription,
  DangerTitle,
  DangerZone,
  DetailRoot,
  ErrorActions,
  ImageGallery,
  ImagePlaceholder,
  InfoCard,
  InfoCardContent,
  InfoLabel,
  InfoRow,
  InfoValue,
  LeftColumn,
  MainImage,
  OwnerAvatar,
  OwnerCard,
  OwnerCardContent,
  OwnerEmail,
  OwnerNameLink,
  OwnerText,
  PageHeaderRow,
  PageTitle,
  RightColumn,
  StatusRow,
  Thumbnail,
  ThumbnailRow,
  ThreeColumnLayout,
} from './ItemDetailPage.styled';

interface ItemDetailPayload {
  item: Item;
}

function formatReward(amount: number): string {
  if (!amount || Number(amount) <= 0) {
    return '—';
  }
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

export function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const [imageIndex, setImageIndex] = useState(0);
  const [statusChange, setStatusChange] = useState<Item['status'] | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'items', id],
    queryFn: () => itemsService.getById(id!) as Promise<ItemDetailPayload>,
    enabled: Boolean(id),
  });

  const item = data?.item;
  const images = item?.image_urls ?? [];
  const claims = item?.claims ?? [];

  const updateStatusMutation = useMutation({
    mutationFn: (next: Item['status']) => itemsService.updateStatus(id!, next),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'items', id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'items'] });
      showSnackbar('Status updated', 'success');
      setStatusChange(null);
    },
    onError: () => showSnackbar('Failed to update status', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => itemsService.delete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'items'] });
      showSnackbar('Item deleted', 'success');
      setDeleteOpen(false);
      navigate('/items');
    },
    onError: () => showSnackbar('Failed to delete item', 'error'),
  });

  const mainSrc = images[imageIndex] ?? images[0];

  const claimCards = useMemo(
    () =>
      claims.map((claim: Claim) => {
        const c = claim.claimant;
        const name = c?.name ?? 'Unknown';
        return (
          <ClaimCard key={claim.id} variant="outlined">
            <ClaimHeader>
              <ClaimAvatar src={c?.avatar_url ?? undefined}>{getInitials(name)}</ClaimAvatar>
              <ClaimMeta>
                <Typography variant="body2" fontWeight={600}>
                  {name}
                </Typography>
                <StatusBadge status={claim.status} type="claim" />
                <Typography variant="caption" color="text.secondary">
                  {formatDate(claim.createdAt)}
                </Typography>
              </ClaimMeta>
              <Button component={Link} to={`/claims/${claim.id}`} size="small" variant="outlined">
                View
              </Button>
            </ClaimHeader>
          </ClaimCard>
        );
      }),
    [claims],
  );

  if (!id) {
    return (
      <DetailRoot>
        <Typography>Invalid item id.</Typography>
      </DetailRoot>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !item) {
    const notFound = isAxiosError(error) && error.response?.status === 404;
    return (
      <DetailRoot>
        <Typography variant="h6">{notFound ? 'Item not found' : 'Failed to load item'}</Typography>
        <ErrorActions>
          <Button component={Link} to="/items" variant="contained">
            Back to items
          </Button>
        </ErrorActions>
      </DetailRoot>
    );
  }

  const owner = item.owner;

  return (
    <DetailRoot>
      <PageHeaderRow>
        <BackButton aria-label="Go back" onClick={() => navigate(-1)}>
          <ArrowBackOutlined />
        </BackButton>
        <PageTitle>{item.title}</PageTitle>
        <Chip
          label={item.type === 'lost' ? 'LOST' : 'FOUND'}
          size="small"
          color={item.type === 'lost' ? 'error' : 'success'}
        />
      </PageHeaderRow>

      <ThreeColumnLayout>
        <LeftColumn>
          <ImageGallery>
            {mainSrc ? (
              <>
                <MainImage src={mainSrc} alt="" />
                {images.length > 1 ? (
                  <ThumbnailRow>
                    {images.map((src, i) => (
                      <Thumbnail
                        key={src}
                        src={src}
                        alt=""
                        $active={i === imageIndex}
                        onClick={() => setImageIndex(i)}
                      />
                    ))}
                  </ThumbnailRow>
                ) : null}
              </>
            ) : (
              <ImagePlaceholder>
                <VisibilityOutlined fontSize="large" />
              </ImagePlaceholder>
            )}
          </ImageGallery>
        </LeftColumn>

        <CenterColumn>
          <InfoCard variant="outlined">
            <InfoCardContent>
              <Typography variant="h6" gutterBottom>
                Details
              </Typography>
              <InfoRow>
                <InfoLabel>Title</InfoLabel>
                <InfoValue>{item.title}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Description</InfoLabel>
                <InfoValue>{item.description ?? '—'}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Category</InfoLabel>
                <InfoValue>{item.category ?? '—'}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Location</InfoLabel>
                <InfoValue>{item.location_name ?? '—'}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Lost / found date</InfoLabel>
                <InfoValue>{item.lost_found_at ? formatDate(item.lost_found_at) : '—'}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Reward</InfoLabel>
                <InfoValue>{formatReward(Number(item.reward_amount))}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Status</InfoLabel>
                <InfoValue>
                  <StatusBadge status={item.status} type="item" />
                </InfoValue>
              </InfoRow>
            </InfoCardContent>
          </InfoCard>

          <StatusRow>
            <FormControl fullWidth size="small" variant="outlined">
              <InputLabel id="item-status-select">Status</InputLabel>
              <Select
                labelId="item-status-select"
                label="Status"
                value={item.status}
                onChange={(e) => {
                  const next = e.target.value as Item['status'];
                  if (next !== item.status) {
                    setStatusChange(next);
                  }
                }}
              >
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="claimed">Claimed</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </StatusRow>

          {owner ? (
            <OwnerCard variant="outlined">
              <OwnerCardContent>
                <OwnerAvatar src={owner.avatar_url ?? undefined}>
                  {getInitials(owner.name)}
                </OwnerAvatar>
                <OwnerText>
                  <OwnerNameLink to={`/users/${owner.id}`}>{owner.name}</OwnerNameLink>
                  <OwnerEmail variant="body2">{owner.email}</OwnerEmail>
                </OwnerText>
              </OwnerCardContent>
            </OwnerCard>
          ) : null}
        </CenterColumn>

        <RightColumn>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Claims
          </Typography>
          {claims.length === 0 ? <EmptyState message="No claims yet" /> : <Box>{claimCards}</Box>}
        </RightColumn>
      </ThreeColumnLayout>

      <DangerZone variant="outlined">
        <DangerTitle>Delete item</DangerTitle>
        <DangerDescription>
          Permanently remove this listing, its claims, and related messages. This cannot be undone.
        </DangerDescription>
        <Button variant="contained" color="error" onClick={() => setDeleteOpen(true)}>
          Delete item
        </Button>
      </DangerZone>

      <ConfirmDialog
        open={Boolean(statusChange)}
        title="Change item status"
        description={`Set status to ${statusChange ?? ''}?`}
        confirmLabel="Update"
        onConfirm={() => statusChange && updateStatusMutation.mutate(statusChange)}
        onCancel={() => setStatusChange(null)}
        isLoading={updateStatusMutation.isPending}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete item"
        description="Delete this item? All claims and messages will also be deleted."
        confirmLabel="Delete"
        confirmColor="error"
        onConfirm={() => deleteMutation.mutate()}
        onCancel={() => setDeleteOpen(false)}
        isLoading={deleteMutation.isPending}
      />
    </DetailRoot>
  );
}
