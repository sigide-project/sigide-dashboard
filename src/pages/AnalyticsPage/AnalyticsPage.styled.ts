import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';

const MOBILE_BP = '768px';
const TABLET_BP = '1200px';

export const AnalyticsRoot = styled(Box)``;

export const PeriodSelector = styled(Box)`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
`;

export const StatsRow = styled(Box)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: ${TABLET_BP}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${MOBILE_BP}) {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 24px;
  }
`;

export const ChartRow = styled(Box)<{ $split?: string }>`
  display: grid;
  grid-template-columns: ${(p) => p.$split || '1fr 1fr'};
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: ${TABLET_BP}) {
    grid-template-columns: 1fr;
  }

  @media (max-width: ${MOBILE_BP}) {
    gap: 12px;
    margin-bottom: 24px;
  }
`;

export const ChartCard = styled(Card)`
  border: 1px solid #e2e8f0;
  box-shadow: none;
  border-radius: 8px;
  padding: 24px;

  @media (max-width: ${MOBILE_BP}) {
    padding: 16px;
  }
`;

export const ChartTitle = styled(Typography)`
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 16px;
`;

export const RatingBars = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const RatingBarRow = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const RatingBarLabel = styled.span`
  font-size: 14px;
  color: #64748b;
  min-width: 30px;
`;

export const RatingBarTrack = styled(Box)`
  flex: 1;
  height: 20px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
`;

export const RatingBarFill = styled(Box)<{ $width: number }>`
  height: 100%;
  width: ${(p) => p.$width}%;
  background: #7c3aed;
  border-radius: 4px;
  transition: width 0.3s;
`;

export const RatingBarValue = styled(Box)`
  display: flex;
  gap: 8px;
  min-width: 80px;
`;
