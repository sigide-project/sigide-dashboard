import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const MOBILE_BP = '768px';

export const ContactRoot = styled(Box)``;

export const FiltersBar = styled(Box)`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
  flex-wrap: wrap;
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

export const SubjectCell = styled.span`
  display: inline-block;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
`;

export const MessageCell = styled.span`
  display: inline-block;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
`;

export const UserLink = styled(Link)`
  color: #7c3aed;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const ExpandedMessage = styled(Box)`
  padding: 16px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;

  @media (max-width: ${MOBILE_BP}) {
    padding: 12px 16px;
  }
`;

export const ExpandedSubject = styled(Typography)`
  font-weight: 600;
  margin-bottom: 8px;
`;

export const ExpandedContent = styled(Typography)`
  font-size: 14px;
  color: #334155;
  line-height: 1.6;
  white-space: pre-wrap;
`;

export const ActionsCell = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;
