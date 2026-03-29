import StarOutlined from '@mui/icons-material/StarOutlined';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';

const MOBILE_BP = '768px';

export const FeedbackRoot = styled(Box)``;

export const SummaryBar = styled(Card)`
  border: 1px solid #e2e8f0;
  box-shadow: none;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 40px;

  @media (max-width: ${MOBILE_BP}) {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
    padding: 16px;
  }
`;

export const SummaryMetric = styled(Box)`
  text-align: center;
`;

export const SummaryValue = styled.span`
  font-size: 32px;
  font-weight: 600;
  color: #0f172a;

  @media (max-width: ${MOBILE_BP}) {
    font-size: 24px;
  }
`;

export const SummaryLabel = styled(Typography)`
  font-size: 13px;
  color: #64748b;
`;

export const RatingBars = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 200px;

  @media (max-width: ${MOBILE_BP}) {
    min-width: 0;
  }
`;

export const RatingBarRow = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const RatingBarLabel = styled.span`
  font-size: 13px;
  color: #64748b;
  min-width: 20px;
`;

export const RatingBarTrack = styled(Box)`
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
`;

export const RatingBarFill = styled(Box)<{ $width: number; $color: string }>`
  height: 100%;
  width: ${(p) => p.$width}%;
  background: ${(p) => p.$color};
  border-radius: 4px;
`;

export const RatingBarCount = styled.span`
  font-size: 12px;
  color: #94a3b8;
  min-width: 30px;
`;

export const FiltersBar = styled(Box)`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
  flex-wrap: wrap;
`;

export const FilterSelect = styled(FormControl)`
  min-width: 180px;

  @media (max-width: ${MOBILE_BP}) {
    min-width: 120px;
    flex: 1;
  }

  .MuiOutlinedInput-root {
    border-radius: 8px;
    background: white;
  }

  .MuiSelect-select {
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

export const ExpandedFeedback = styled(Box)`
  padding: 16px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;

  @media (max-width: ${MOBILE_BP}) {
    padding: 12px 16px;
  }
`;

export const FeedbackPreviewCell = styled.span`
  display: inline-block;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
`;

export const ActionsCell = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const AvgRatingBlock = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SummaryStarIcon = styled(StarOutlined)`
  font-size: 36px;
  color: #f59e0b;

  @media (max-width: ${MOBILE_BP}) {
    font-size: 28px;
  }
`;
