import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const MOBILE_BP = '768px';

export const DetailRoot = styled(Box)``;

export const PageHeaderRow = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
`;

export const BackButton = styled(IconButton)`
  margin-left: -8px;
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #0f172a;
  font-family: Inter, system-ui, sans-serif;

  @media (max-width: ${MOBILE_BP}) {
    font-size: 20px;
  }
`;

export const TwoColumnLayout = styled(Box)`
  display: flex;
  gap: 24px;

  @media (max-width: ${MOBILE_BP}) {
    flex-direction: column;
  }
`;

export const LeftColumn = styled(Box)`
  width: 360px;
  flex-shrink: 0;

  @media (max-width: ${MOBILE_BP}) {
    width: 100%;
  }
`;

export const RightColumn = styled(Box)`
  flex: 1;
  min-width: 0;
`;

export const UserCard = styled(Card)`
  border: 1px solid #e2e8f0;
  box-shadow: none;
  border-radius: 8px;
  margin-bottom: 20px;
`;

export const UserCardContent = styled(CardContent)`
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const LargeAvatar = styled(Avatar)`
  width: 80px;
  height: 80px;
  background: #7c3aed;
  font-size: 28px;
  margin-bottom: 16px;
`;

export const UserName = styled(Typography)`
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
`;

export const UserEmail = styled(Typography)`
  font-size: 14px;
  color: #64748b;
  margin-top: 4px;
`;

export const InfoRow = styled(Box)`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #e2e8f0;

  &:last-child {
    border-bottom: none;
  }
`;

export const InfoLabel = styled(Typography)`
  font-size: 13px;
  color: #64748b;
`;

export const InfoValue = styled(Typography)`
  font-size: 14px;
  color: #0f172a;
  font-weight: 500;
`;

export const QuickStats = styled(Box)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
`;

export const QuickStatCard = styled(Card)`
  border: 1px solid #e2e8f0;
  box-shadow: none;
  text-align: center;
  padding: 16px;
`;

export const QuickStatValue = styled(Typography)`
  font-size: 24px;
  font-weight: 600;
  color: #0f172a;
`;

export const QuickStatLabel = styled(Typography)`
  font-size: 12px;
  color: #64748b;
`;

export const ActionButtons = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const TabsCard = styled(Card)`
  border: 1px solid #e2e8f0;
  box-shadow: none;
  border-radius: 8px;
`;

export const TabPanelBox = styled(Box)`
  padding: 16px;
  overflow-x: auto;
`;

export const TableEntityLink = styled(Link)`
  font-size: 14px;
  font-weight: 500;
  color: #0f172a;
  text-decoration: none;

  &:hover {
    color: #7c3aed;
  }
`;

export const ErrorActions = styled(Box)`
  margin-top: 16px;
`;
