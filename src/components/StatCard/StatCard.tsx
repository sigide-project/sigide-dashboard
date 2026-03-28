import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { CardContentStyled, CardRoot, IconWrapper, StatLabel, StatValue } from './StatCard.styled';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
}

export function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <CardRoot variant="outlined">
      <CardContentStyled>
        <IconWrapper $color={color}>{icon}</IconWrapper>
        <Box>
          <StatValue>{value}</StatValue>
          <StatLabel>{title}</StatLabel>
        </Box>
      </CardContentStyled>
    </CardRoot>
  );
}
