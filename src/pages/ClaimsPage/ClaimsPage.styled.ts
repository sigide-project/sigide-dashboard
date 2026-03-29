import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const MOBILE_BP = '768px';

export const ClaimsRoot = styled(Box)``;

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

export const ItemLink = styled(Link)`
  color: #0f172a;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    color: #7c3aed;
  }
`;

export const UserLink = styled(Link)`
  color: #64748b;
  text-decoration: none;

  &:hover {
    color: #7c3aed;
  }
`;

export const ActionsCell = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;
