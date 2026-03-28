import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const MOBILE_BP = '768px';

export const DetailRoot = styled(Box)``;

export const TwoColumnLayout = styled(Box)`
  display: flex;
  gap: 24px;

  @media (max-width: ${MOBILE_BP}) {
    flex-direction: column;
  }
`;

export const LeftColumn = styled(Box)`
  width: 340px;
  flex-shrink: 0;

  @media (max-width: ${MOBILE_BP}) {
    width: 100%;
  }
`;

export const RightColumn = styled(Box)`
  flex: 1;
  min-width: 0;
`;

export const InfoCard = styled(Card)`
  border: 1px solid #e2e8f0;
  box-shadow: none;
  border-radius: 8px;
  margin-bottom: 20px;
`;

export const InfoCardContent = styled(CardContent)`
  padding: 24px;

  @media (max-width: ${MOBILE_BP}) {
    padding: 16px;
  }
`;

export const StatusSection = styled(Box)`
  margin-bottom: 20px;
`;

export const StatusLabel = styled(Typography)`
  font-size: 13px;
  color: #64748b;
  margin-bottom: 8px;
`;

export const StatusControls = styled(Box)`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

export const CompactCard = styled(Card)`
  border: 1px solid #e2e8f0;
  box-shadow: none;
  border-radius: 8px;
  margin-bottom: 16px;
  padding: 16px;
`;

export const CompactCardRow = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const SmallAvatar = styled(Avatar)`
  width: 36px;
  height: 36px;
  background: #7c3aed;
  font-size: 14px;
`;

export const PersonName = styled(Typography)`
  font-size: 14px;
  font-weight: 500;
  color: #0f172a;
`;

export const PersonEmail = styled(Typography)`
  font-size: 13px;
  color: #64748b;
`;

export const ProofSection = styled(Box)`
  margin-top: 16px;
`;

export const ProofTitle = styled(Typography)`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
`;

export const ProofText = styled(Typography)`
  font-size: 14px;
  color: #334155;
  line-height: 1.6;
`;

export const ProofImages = styled(Box)`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
`;

export const ProofImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 6px;
  object-fit: cover;

  @media (max-width: ${MOBILE_BP}) {
    width: 64px;
    height: 64px;
  }
`;

export const MessagesSection = styled(Card)`
  border: 1px solid #e2e8f0;
  box-shadow: none;
  border-radius: 8px;
`;

export const MessagesSectionHeader = styled(Box)`
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;

  @media (max-width: ${MOBILE_BP}) {
    padding: 12px 16px;
  }
`;

export const MessagesList = styled(Box)`
  padding: 24px;
  max-height: 600px;
  overflow-y: auto;

  @media (max-width: ${MOBILE_BP}) {
    padding: 16px;
  }
`;

export const MessageBubble = styled(Box)<{ $isSender?: boolean }>`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 12px;

  ${(p) =>
    p.$isSender
      ? 'margin-left: auto; background: #7C3AED; color: white;'
      : 'background: #F1F5F9; color: #0F172A;'}

  @media (max-width: ${MOBILE_BP}) {
    max-width: 85%;
  }
`;

export const MessageSender = styled(Typography)<{ $isSender?: boolean }>`
  font-size: 12px;
  margin-bottom: 4px;
  color: ${(p) => (p.$isSender ? 'rgba(255,255,255,0.7)' : '#64748B')};
`;

export const MessageContent = styled(Typography)`
  font-size: 14px;
  line-height: 1.5;

  && {
    color: inherit;
  }
`;

export const MessageTime = styled(Typography)<{ $isSender?: boolean }>`
  font-size: 11px;
  margin-top: 4px;
  color: ${(p) => (p.$isSender ? 'rgba(255,255,255,0.5)' : '#94A3B8')};
`;

export const ReadOnlyBanner = styled(Box)`
  background: #fef3c7;
  padding: 8px 16px;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 16px;
`;

export const DetailHeaderRow = styled(Box)`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
`;

export const ItemThumb = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
`;

export const ItemThumbPlaceholder = styled(Box)`
  width: 48px;
  height: 48px;
  border-radius: 6px;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const ItemCardBody = styled(Box)`
  flex: 1;
  min-width: 0;
`;

export const ItemTitleLink = styled(Link)`
  font-weight: 600;
  font-size: 14px;
  color: #0f172a;
  text-decoration: none;
  display: block;
  margin-bottom: 4px;

  &:hover {
    color: #7c3aed;
  }
`;

export const PersonProfileLink = styled(Link)`
  text-decoration: none;
  color: inherit;

  &:hover .person-name {
    color: #7c3aed;
  }
`;
