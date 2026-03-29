import Box from '@mui/material/Box';
import styled from 'styled-components';

const SIDEBAR_WIDTH = 260;
const TOPBAR_HEIGHT = 64;
const MOBILE_BP = '768px';

export const LayoutRoot = styled(Box)`
  display: flex;
  min-height: 100vh;
`;

export const ContentWrapper = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: ${SIDEBAR_WIDTH}px;

  @media (max-width: ${MOBILE_BP}) {
    margin-left: 0;
  }
`;

export const MainContent = styled(Box)`
  flex: 1;
  min-width: 0;
  margin-top: ${TOPBAR_HEIGHT}px;
  padding: 24px;
  background: #f8fafc;
  overflow-y: auto;
  overflow-x: hidden;

  @media (max-width: ${MOBILE_BP}) {
    padding: 16px;
  }
`;

export const MobileOverlay = styled(Box)`
  display: none;

  @media (max-width: ${MOBILE_BP}) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1150;
  }
`;
