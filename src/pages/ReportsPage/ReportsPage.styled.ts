import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';

const MOBILE_BP = '768px';

export const ReportsRoot = styled(Box)``;

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

export const DescriptionCell = styled.span`
  display: inline-block;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
`;

export const ListingLink = styled.a`
  color: #3b82f6;
  text-decoration: none;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;

  &:hover {
    text-decoration: underline;
  }
`;

export const ExpandedRow = styled(Box)`
  padding: 16px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;

  @media (max-width: ${MOBILE_BP}) {
    padding: 12px 16px;
  }
`;

export const ExpandedDescription = styled(Typography)`
  font-size: 14px;
  color: #334155;
  line-height: 1.6;
`;

export const StatusSelect = styled(Select)`
  min-width: 150px;
  font-size: 13px;
`;

export const ActionsCell = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export type IssueTone = 'bug' | 'suspicious' | 'inappropriate' | 'scam' | 'account' | 'other';

export const IssueTypeChip = styled(Chip)<{ $tone: IssueTone }>`
  &&.MuiChip-root {
    color: white;
    font-size: 12px;
    ${(p) => {
      switch (p.$tone) {
        case 'bug':
          return `background-color: #3b82f6;`;
        case 'suspicious':
          return `background-color: #f59e0b;`;
        case 'inappropriate':
        case 'scam':
          return `background-color: #ef4444;`;
        case 'account':
          return `background-color: #f97316;`;
        default:
          return `background-color: #64748b;`;
      }
    }}
  }
`;
