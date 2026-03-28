import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';

export const EmptyRoot = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  color: #64748b;
`;

export const EmptyMessage = styled(Typography)`
  && {
    color: #64748b;
    text-align: center;
    margin-top: 16px;
  }
`;
