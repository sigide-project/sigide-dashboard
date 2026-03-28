import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import styled from 'styled-components';

export const TableWrapper = styled(Box)`
  position: relative;
  min-height: 200px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

export const StyledTable = styled(Table)`
  white-space: nowrap;
`;

export const HeaderCell = styled(TableCell)<{ $width?: string | number }>`
  && {
    font-weight: 600;
    color: #64748b;
    font-size: 13px;
    background: #f8fafc;
    border-bottom: 2px solid #e2e8f0;
    position: sticky;
    top: 0;
    z-index: 2;
  }

  ${(p) =>
    p.$width != null ? `width: ${typeof p.$width === 'number' ? `${p.$width}px` : p.$width};` : ''}
`;

export const HeaderRow = styled(TableRow)`
  && {
    background: transparent;
  }
`;

export const BodyRow = styled(TableRow)`
  &:nth-of-type(odd) {
    background: #f8fafc;
  }

  &:hover {
    background: #f1f5f9;
  }
`;

export const BodyCell = styled(TableCell)<{ $width?: string | number }>`
  && {
    font-size: 14px;
    color: #0f172a;
    border-color: #e2e8f0;
  }

  ${(p) =>
    p.$width != null ? `width: ${typeof p.$width === 'number' ? `${p.$width}px` : p.$width};` : ''}
`;

export const LoadingOverlay = styled(Box)`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.7);
  z-index: 10;
`;
