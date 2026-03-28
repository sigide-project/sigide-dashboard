import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import styled from 'styled-components';

export const StyledSnackbar = styled(Snackbar)`
  && {
    bottom: 24px;
  }
`;

export const StyledAlert = styled(Alert)`
  && {
    min-width: 280px;
  }
`;
