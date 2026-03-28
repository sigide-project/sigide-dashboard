import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';

export const NotFoundRoot = styled(Box)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
`;

export const NotFoundCode = styled(Typography)`
  && {
    font-size: 120px;
    font-weight: 700;
    color: #e2e8f0;
    line-height: 1;

    @media (max-width: 768px) {
      font-size: 80px;
    }
  }
`;

export const NotFoundText = styled(Typography)`
  && {
    font-size: 20px;
    color: #64748b;
  }
`;
