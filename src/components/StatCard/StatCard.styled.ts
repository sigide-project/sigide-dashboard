import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';

const MOBILE_BP = '768px';

export const CardRoot = styled(Card)`
  && {
    border: 1px solid #e2e8f0;
    box-shadow: none;
    border-radius: 8px;
  }
`;

export const CardContentStyled = styled(CardContent)`
  && {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 24px;

    @media (max-width: ${MOBILE_BP}) {
      padding: 16px;
      gap: 12px;
    }
  }
`;

export const IconWrapper = styled(Box)<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => `${p.$color}20`};
  color: ${(p) => p.$color};

  @media (max-width: ${MOBILE_BP}) {
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }
`;

export const StatValue = styled(Typography)`
  && {
    font-size: 32px;
    font-weight: 600;
    color: #0f172a;
    line-height: 1.2;

    @media (max-width: ${MOBILE_BP}) {
      font-size: 24px;
    }
  }
`;

export const StatLabel = styled(Typography)`
  && {
    font-size: 14px;
    color: #64748b;
  }
`;
