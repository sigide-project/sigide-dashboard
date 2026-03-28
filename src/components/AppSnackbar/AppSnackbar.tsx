import type { AlertColor } from '@mui/material/Alert';
import { StyledAlert, StyledSnackbar } from './AppSnackbar.styled';

export interface AppSnackbarProps {
  open: boolean;
  message: string;
  severity: AlertColor;
  onClose: () => void;
}

export function AppSnackbar({ open, message, severity, onClose }: AppSnackbarProps) {
  return (
    <StyledSnackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <StyledAlert onClose={onClose} severity={severity} variant="filled">
        {message}
      </StyledAlert>
    </StyledSnackbar>
  );
}
