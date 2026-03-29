import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const MOBILE_BP = '768px';

export const UsersRoot = styled(Box)``;

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

export const UserCell = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const UserAvatar = styled(Avatar)`
  width: 36px;
  height: 36px;
  background: #7c3aed;
  font-size: 14px;
`;

export const UserLink = styled(Link)`
  color: #0f172a;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    color: #7c3aed;
  }
`;

export const ActionsCell = styled(Box)`
  display: flex;
  gap: 4px;
`;
