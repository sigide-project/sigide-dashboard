import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const MOBILE_BP = '768px';
const TABLET_BP = '1200px';

export const DashboardRoot = styled(Box)``;

export const StatsGrid = styled(Box)`
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

export const ChartRow = styled(Box)`
  display: flex;
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: ${TABLET_BP}) {
    flex-direction: column;
  }

  @media (max-width: ${MOBILE_BP}) {
    gap: 12px;
    margin-bottom: 24px;
  }
`;

export const ChartCard = styled(Card)`
  && {
    border: 1px solid #e2e8f0;
    box-shadow: none;
    border-radius: 8px;
    padding: 24px;
    flex: var(--flex, 1);
    min-width: 0;

    @media (max-width: ${MOBILE_BP}) {
      padding: 16px;
    }
  }
`;

export const ChartTitle = styled(Typography)`
  && {
    font-size: 16px;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 16px;
  }
`;

export const PeriodToggle = styled(ToggleButtonGroup)`
  && {
    margin-bottom: 16px;
  }
`;

export const TableSection = styled(Box)`
  display: flex;
  gap: 20px;

  @media (max-width: ${TABLET_BP}) {
    flex-direction: column;
  }

  @media (max-width: ${MOBILE_BP}) {
    gap: 12px;
  }
`;

export const TableCard = styled(Card)`
  && {
    flex: 1;
    border: 1px solid #e2e8f0;
    box-shadow: none;
    border-radius: 8px;
    min-width: 0;
    overflow-x: auto;
  }
`;

export const TableCardHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;

  @media (max-width: ${MOBILE_BP}) {
    padding: 12px 16px;
  }
`;

export const ViewAllLink = styled(Link)`
  color: #7c3aed;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const FeedbackRow = styled(Box)`
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;

  @media (max-width: ${MOBILE_BP}) {
    padding: 12px 16px;
  }
`;

export const FeedbackPreview = styled(Typography)`
  && {
    font-size: 14px;
    color: #475569;
    margin-top: 4px;
  }
`;

export const FeedbackMeta = styled(Typography)`
  && {
    font-size: 12px;
    color: #94a3b8;
    margin-top: 8px;
  }
`;

export const TableSectionTitle = styled(Typography)`
  && {
    margin: 0;
    font-weight: 600;
    font-size: 16px;
    color: #0f172a;
  }
`;

export const FeedbackAuthor = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  font-weight: 500;
  color: #0f172a;
`;
