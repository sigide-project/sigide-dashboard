import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import styled from 'styled-components';

const MOBILE_BP = '768px';

export const SidebarRoot = styled(Box)<{ $open?: boolean }>`
  width: 260px;
  min-height: 100vh;
  background: #0f172a;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1200;
  transition: transform 0.3s ease;

  @media (max-width: ${MOBILE_BP}) {
    transform: translateX(${(p) => (p.$open ? '0' : '-100%')});
  }
`;

export const LogoWrapper = styled(Box)`
  padding: 20px 24px;
  display: flex;
  align-items: center;
`;

export const LogoImage = styled.img`
  height: 46px;
  width: auto;
  object-fit: contain;
`;

export const NavList = styled(List)`
  flex: 1;
  padding: 8px;
`;

export const NavItem = styled(ListItemButton)<{ $active?: boolean }>`
  && {
    border-radius: 8px;
    margin-bottom: 4px;
    color: rgba(255, 255, 255, 0.7);
    padding: 10px 16px;
  }

  ${(p) =>
    p.$active &&
    `
    && {
      color: #7c3aed;
      background: rgba(124, 58, 237, 0.1);
      border-left: 3px solid #7c3aed;
    }
  `}

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

export const NavItemText = styled(ListItemText)`
  & .MuiTypography-root {
    font-size: 14px;
    font-weight: 500;
  }
`;

export const NavItemIcon = styled(ListItemIcon)`
  && {
    color: inherit;
    min-width: 40px;
  }
`;

export const BadgeStyled = styled(Badge)`
  && {
    width: 100%;
  }

  & .MuiBadge-badge {
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

export const NavDivider = styled(Divider)`
  && {
    border-color: rgba(255, 255, 255, 0.12);
  }
`;
