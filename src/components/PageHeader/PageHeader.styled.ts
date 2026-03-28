import Box from '@mui/material/Box';
import styled from 'styled-components';

const MOBILE_BP = '768px';

export const HeaderRoot = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  @media (max-width: ${MOBILE_BP}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
  }
`;

export const Title = styled('h1')`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #0f172a;
  font-family: Inter, system-ui, sans-serif;

  @media (max-width: ${MOBILE_BP}) {
    font-size: 20px;
  }
`;

export const LeftColumn = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
