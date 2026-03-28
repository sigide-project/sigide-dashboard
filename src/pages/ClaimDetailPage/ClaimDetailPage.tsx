import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { isAxiosError } from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ConfirmDialog,
  EmptyState,
  LoadingSpinner,
  PageHeader,
  StatusBadge,
  useSnackbar,
} from '@/components';
import { claimsService } from '@/services';
import type { Claim, Message } from '@/types';
import { formatDate, formatDateTime, getInitials } from '@/utils';
import {
  CompactCard,
  CompactCardRow,
  DetailHeaderRow,
  DetailRoot,
  InfoCard,
  InfoCardContent,
  ItemCardBody,
  ItemTitleLink,
  ItemThumb,
  ItemThumbPlaceholder,
  LeftColumn,
  MessageBubble,
  MessageContent,
  MessagesList,
  MessageSender,
  MessagesSection,
  MessagesSectionHeader,
  MessageTime,
  PersonEmail,
  PersonName,
  PersonProfileLink,
  ProofImages,
  ProofImage,
  ProofSection,
  ProofText,
  ProofTitle,
  ReadOnlyBanner,
  RightColumn,
  SmallAvatar,
  StatusControls,
  StatusLabel,
  StatusSection,
  TwoColumnLayout,
} from './ClaimDetailPage.styled';

type AdminClaimStatus = Claim['status'];

function itemThumbUrl(item: Claim['item']): string | undefined {
  if (!item || typeof item !== 'object') {
    return undefined;
  }
  const rec = item as { image_urls?: string[] };
  return rec.image_urls?.[0];
}

export function ClaimDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const [statusDraft, setStatusDraft] = useState<AdminClaimStatus>('pending' as AdminClaimStatus);
  const [confirmStatus, setConfirmStatus] = useState<AdminClaimStatus | null>(null);

  const {
    data: claim,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['admin', 'claims', id],
    queryFn: async () => {
      const payload = (await claimsService.getById(id!)) as { claim: Claim };
      return payload.claim;
    },
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (claim) {
      setStatusDraft(claim.status);
    }
  }, [claim]);

  const updateMutation = useMutation({
    mutationFn: (status: string) => claimsService.updateStatus(id!, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'claims'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'claims', id] });
      showSnackbar('Claim status updated', 'success');
      setConfirmStatus(null);
    },
    onError: () => showSnackbar('Failed to update status', 'error'),
  });

  const handleSaveClick = () => {
    if (!claim || statusDraft === claim.status) {
      return;
    }
    setConfirmStatus(statusDraft);
  };

  if (!id) {
    return (
      <DetailRoot>
        <Typography>Invalid claim id.</Typography>
      </DetailRoot>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !claim) {
    const notFound = isAxiosError(error) && error.response?.status === 404;
    return (
      <DetailRoot>
        <Typography variant="h6">
          {notFound ? 'Claim not found' : 'Failed to load claim'}
        </Typography>
        <Button component={Link} to="/claims" variant="contained">
          Back to claims
        </Button>
      </DetailRoot>
    );
  }

  const messages = claim.messages ?? [];
  const thumb = itemThumbUrl(claim.item);
  const claimant = claim.claimant;
  const itemOwner =
    claim.item && 'owner' in claim.item
      ? (claim.item as { owner?: Claim['owner'] }).owner
      : undefined;
  const owner = claim.owner ?? itemOwner;
  const titleId = id.slice(0, 8);

  return (
    <DetailRoot>
      <DetailHeaderRow>
        <IconButton aria-label="Back" onClick={() => navigate('/claims')} size="small">
          <ArrowBackOutlined />
        </IconButton>
        <Box flex={1} minWidth={0}>
          <PageHeader
            title={`Claim #${titleId}`}
            breadcrumbs={[{ label: 'Claims', href: '/claims' }]}
          />
        </Box>
      </DetailHeaderRow>

      <TwoColumnLayout>
        <LeftColumn>
          <InfoCard variant="outlined">
            <InfoCardContent>
              <StatusSection>
                <StatusLabel>Status</StatusLabel>
                <StatusBadge status={claim.status} type="claim" />
              </StatusSection>
              <Typography variant="body2" color="text.secondary">
                Submitted {formatDate(claim.createdAt)}
              </Typography>
              {claim.resolved_at ? (
                <Typography variant="body2" color="text.secondary">
                  Resolved {formatDate(claim.resolved_at)}
                </Typography>
              ) : null}
            </InfoCardContent>
          </InfoCard>

          <InfoCard variant="outlined">
            <InfoCardContent>
              <StatusLabel>Admin status override</StatusLabel>
              <StatusControls>
                <Select<AdminClaimStatus>
                  size="small"
                  value={statusDraft}
                  onChange={(e) => setStatusDraft(e.target.value as AdminClaimStatus)}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Claim status' }}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="accepted">Accepted</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="disputed">Disputed</MenuItem>
                </Select>
                <Button variant="contained" size="small" onClick={handleSaveClick}>
                  Save
                </Button>
              </StatusControls>
            </InfoCardContent>
          </InfoCard>

          <CompactCard variant="outlined">
            <CompactCardRow>
              {thumb ? <ItemThumb src={thumb} alt="" /> : <ItemThumbPlaceholder />}
              <ItemCardBody>
                {claim.item ? (
                  <>
                    <ItemTitleLink to={`/items/${claim.item_id}`}>{claim.item.title}</ItemTitleLink>
                    <Chip
                      label={claim.item.type === 'lost' ? 'LOST' : 'FOUND'}
                      size="small"
                      color={claim.item.type === 'lost' ? 'error' : 'success'}
                    />
                  </>
                ) : (
                  <Typography variant="body2">Item unavailable</Typography>
                )}
              </ItemCardBody>
            </CompactCardRow>
          </CompactCard>

          <CompactCard variant="outlined">
            <CompactCardRow>
              <SmallAvatar src={claimant?.avatar_url ?? undefined}>
                {getInitials(claimant?.name ?? '?')}
              </SmallAvatar>
              <Box>
                {claimant ? (
                  <PersonProfileLink to={`/users/${claimant.id}`}>
                    <PersonName className="person-name">{claimant.name}</PersonName>
                  </PersonProfileLink>
                ) : (
                  <PersonName>Unknown</PersonName>
                )}
                <PersonEmail>{claimant?.email ?? '—'}</PersonEmail>
              </Box>
            </CompactCardRow>
          </CompactCard>

          <CompactCard variant="outlined">
            <CompactCardRow>
              <SmallAvatar src={owner?.avatar_url ?? undefined}>
                {getInitials(owner?.name ?? '?')}
              </SmallAvatar>
              <Box>
                {owner ? (
                  <PersonProfileLink to={`/users/${owner.id}`}>
                    <PersonName className="person-name">{owner.name}</PersonName>
                  </PersonProfileLink>
                ) : (
                  <PersonName>Unknown</PersonName>
                )}
                <PersonEmail>{owner?.email ?? '—'}</PersonEmail>
              </Box>
            </CompactCardRow>
          </CompactCard>

          <ProofSection>
            <ProofTitle>Proof</ProofTitle>
            {claim.proof_description ? (
              <ProofText>{claim.proof_description}</ProofText>
            ) : (
              <ProofText color="text.secondary">No description</ProofText>
            )}
            {claim.proof_images?.length ? (
              <ProofImages>
                {claim.proof_images.map((src) => (
                  <ProofImage key={src} src={src} alt="" />
                ))}
              </ProofImages>
            ) : null}
          </ProofSection>
        </LeftColumn>

        <RightColumn>
          <MessagesSection variant="outlined">
            <MessagesSectionHeader>
              <Typography fontWeight={600}>Messages</Typography>
            </MessagesSectionHeader>
            <ReadOnlyBanner>
              <Typography variant="body2">Conversation (read-only)</Typography>
            </ReadOnlyBanner>
            <MessagesList>
              {messages.length === 0 ? (
                <EmptyState message="No messages in this thread" />
              ) : (
                messages.map((m: Message) => {
                  const isOwnerSide = m.sender_id !== claim.claimant_id;
                  const senderName = m.sender?.name ?? 'User';
                  return (
                    <MessageBubble key={m.id} $isSender={isOwnerSide}>
                      <MessageSender variant="caption" display="block" $isSender={isOwnerSide}>
                        {senderName}
                      </MessageSender>
                      <MessageContent variant="body2" color="inherit">
                        {m.content}
                      </MessageContent>
                      <MessageTime variant="caption" display="block" $isSender={isOwnerSide}>
                        {formatDateTime(m.createdAt)}
                      </MessageTime>
                    </MessageBubble>
                  );
                })
              )}
            </MessagesList>
          </MessagesSection>
        </RightColumn>
      </TwoColumnLayout>

      <ConfirmDialog
        open={confirmStatus !== null}
        title="Update claim status"
        description={`Set status to ${confirmStatus ?? ''}?`}
        confirmLabel="Update"
        onConfirm={() => confirmStatus && updateMutation.mutate(confirmStatus)}
        onCancel={() => setConfirmStatus(null)}
        isLoading={updateMutation.isPending}
      />
    </DetailRoot>
  );
}
