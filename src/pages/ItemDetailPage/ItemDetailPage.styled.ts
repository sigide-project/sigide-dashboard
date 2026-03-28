import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const MOBILE_BP = '768px';
const TABLET_BP = '1024px';

export const DetailRoot = styled(Box)``;

export const PageHeaderRow = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
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

export const ThreeColumnLayout = styled(Box)`
  display: flex;
  gap: 24px;

  @media (max-width: ${TABLET_BP}) {
    flex-wrap: wrap;
  }

  @media (max-width: ${MOBILE_BP}) {
    flex-direction: column;
  }
`;

export const LeftColumn = styled(Box)`
  width: 280px;
  flex-shrink: 0;

  @media (max-width: ${TABLET_BP}) {
    width: 100%;
    order: 1;
  }
`;

export const CenterColumn = styled(Box)`
  flex: 1;
  min-width: 0;

  @media (max-width: ${TABLET_BP}) {
    width: 100%;
    order: 3;
  }
`;

export const RightColumn = styled(Box)`
  width: 280px;
  flex-shrink: 0;

  @media (max-width: ${TABLET_BP}) {
    width: 100%;
    order: 2;
  }
`;

export const ImageGallery = styled(Box)`
  margin-bottom: 16px;
`;

export const MainImage = styled.img`
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
  max-height: 280px;
`;

export const ThumbnailRow = styled(Box)`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
`;

export const Thumbnail = styled.img<{ $active?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 6px;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid ${(p) => (p.$active ? '#7c3aed' : 'transparent')};
`;

export const ImagePlaceholder = styled(Box)`
  width: 100%;
  height: 200px;
  border-radius: 8px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
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

export const InfoRow = styled(Box)`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
`;

export const InfoLabel = styled(Typography)`
  font-size: 13px;
  color: #64748b;
`;

export const InfoValue = styled(Typography)`
  font-size: 14px;
  color: #0f172a;
`;

export const OwnerCard = styled(Card)`
  border: 1px solid #e2e8f0;
  box-shadow: none;
  border-radius: 8px;
  margin-bottom: 20px;
`;

export const OwnerCardContent = styled(CardContent)`
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const OwnerAvatar = styled(Avatar)`
  width: 48px;
  height: 48px;
  background: #7c3aed;
  font-size: 16px;
`;

export const OwnerText = styled(Box)`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const OwnerNameLink = styled(Link)`
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
  text-decoration: none;

  &:hover {
    color: #7c3aed;
  }
`;

export const OwnerEmail = styled(Typography)`
  font-size: 13px;
  color: #64748b;
`;

export const ClaimCard = styled(Card)`
  border: 1px solid #e2e8f0;
  box-shadow: none;
  border-radius: 8px;
  margin-bottom: 12px;
  padding: 16px;
`;

export const ClaimHeader = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

export const ClaimAvatar = styled(Avatar)`
  width: 40px;
  height: 40px;
  background: #7c3aed;
  font-size: 14px;
`;

export const ClaimMeta = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

export const DangerZone = styled(Card)`
  border: 2px solid #fee2e2;
  box-shadow: none;
  border-radius: 8px;
  margin-top: 32px;
  padding: 24px;

  @media (max-width: ${MOBILE_BP}) {
    padding: 16px;
    margin-top: 24px;
  }
`;

export const DangerTitle = styled(Typography)`
  color: #ef4444;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 8px;
`;

export const DangerDescription = styled(Typography)`
  color: #64748b;
  font-size: 14px;
  margin-bottom: 16px;
`;

export const ErrorActions = styled(Box)`
  margin-top: 16px;
`;

export const StatusRow = styled(Box)`
  margin-top: 16px;
  max-width: 280px;

  @media (max-width: ${MOBILE_BP}) {
    max-width: 100%;
  }
`;
