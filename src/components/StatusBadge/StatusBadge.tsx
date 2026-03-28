import type { ChipProps } from '@mui/material/Chip';
import { StyledChip } from './StatusBadge.styled';

export type StatusBadgeType = 'item' | 'claim' | 'user' | 'report';

export interface StatusBadgeProps {
  status: string;
  type?: StatusBadgeType;
}

function normalizeStatus(status: string): string {
  return status.toLowerCase().replace(/\s+/g, '_');
}

function chipPropsFor(
  status: string,
  type: StatusBadgeType | undefined,
): { color: ChipProps['color']; label: string } {
  const s = normalizeStatus(status);
  const label = status.replace(/_/g, ' ');

  if (type === 'item') {
    if (s === 'open') return { color: 'warning', label };
    if (s === 'claimed') return { color: 'info', label };
    if (s === 'resolved') return { color: 'success', label };
    if (s === 'cancelled') return { color: 'default', label };
  }

  if (type === 'claim') {
    if (s === 'pending') return { color: 'warning', label };
    if (s === 'accepted') return { color: 'success', label };
    if (s === 'rejected') return { color: 'error', label };
    if (s === 'resolved') return { color: 'info', label };
    if (s === 'disputed') return { color: 'error', label };
  }

  if (type === 'user') {
    if (s === 'user') return { color: 'info', label };
    if (s === 'admin') return { color: 'primary', label };
    if (s === 'banned') return { color: 'error', label };
  }

  if (type === 'report') {
    if (s === 'open') return { color: 'warning', label };
    if (s === 'reviewing') return { color: 'info', label };
    if (s === 'resolved') return { color: 'success', label };
    if (s === 'dismissed') return { color: 'default', label };
  }

  return { color: 'default', label: status };
}

export function StatusBadge({ status, type }: StatusBadgeProps) {
  const { color, label } = chipPropsFor(status, type);
  return <StyledChip size="small" variant="filled" color={color} label={label} />;
}
