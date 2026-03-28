import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const MOBILE_BP = '768px';

export const ItemsRoot = styled(Box)``;

export const FiltersBar = styled(Box)`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;
`;

export const SearchField = styled(TextField)`
  width: 300px;

  @media (max-width: ${MOBILE_BP}) {
    width: 100%;
  }

  .MuiOutlinedInput-root {
    border-radius: 8px;
    background: white;
  }
`;

export const FilterSelect = styled(FormControl)`
  min-width: 140px;

  @media (max-width: ${MOBILE_BP}) {
    min-width: 0;
    flex: 1;
  }

  .MuiOutlinedInput-root {
    border-radius: 8px;
    background: white;
  }
`;

export const ThumbnailImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
`;

export const ThumbnailPlaceholder = styled(Box)`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
`;

export const ItemLink = styled(Link)`
  color: #0f172a;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    color: #7c3aed;
  }
`;

export const OwnerLink = styled(Link)`
  color: #64748b;
  text-decoration: none;

  &:hover {
    color: #7c3aed;
  }
`;

export const ActionsCell = styled(Box)`
  display: flex;
  gap: 4px;
  align-items: center;
`;
