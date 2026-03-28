import type { ReactNode } from 'react';
import InboxOutlined from '@mui/icons-material/InboxOutlined';
import { EmptyMessage, EmptyRoot } from './EmptyState.styled';

export interface EmptyStateProps {
  message?: string;
  icon?: ReactNode;
}

export function EmptyState({ message = 'No data to display', icon }: EmptyStateProps) {
  return (
    <EmptyRoot>
      {icon ?? <InboxOutlined fontSize="large" />}
      <EmptyMessage variant="body1">{message}</EmptyMessage>
    </EmptyRoot>
  );
}
