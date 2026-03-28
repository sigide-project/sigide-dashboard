import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import styled from 'styled-components';

const SIDEBAR_WIDTH = 260;
const TOPBAR_HEIGHT = 64;
const MOBILE_BP = '768px';

export const TopBarRoot = styled(AppBar)`
  && {
    background: #ffffff;
    box-shadow: none;
    border-bottom: 1px solid #e2e8f0;
    height: ${TOPBAR_HEIGHT}px;
    left: ${SIDEBAR_WIDTH}px;
    width: calc(100% - ${SIDEBAR_WIDTH}px);
    z-index: 1100;

    @media (max-width: ${MOBILE_BP}) {
      left: 0;
      width: 100%;
    }
  }
`;

export const TopBarToolbar = styled(Toolbar)`
  && {
    height: ${TOPBAR_HEIGHT}px;
    display: flex;
    justify-content: space-between;
  }
`;

export const LeftSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const HamburgerButton = styled(IconButton)`
  && {
    display: none;
    color: #0f172a;

    @media (max-width: ${MOBILE_BP}) {
      display: flex;
    }
  }
`;

export const PageTitle = styled('h1')`
  margin: 0;
  color: #0f172a;
  font-weight: 600;
  font-size: 20px;
  font-family: Inter, system-ui, sans-serif;

  @media (max-width: ${MOBILE_BP}) {
    font-size: 18px;
  }
`;
