import { createContext } from 'react';
import type { AlertColor } from '@mui/material/Alert';

export type SnackbarSeverity = AlertColor;

export interface SnackbarContextValue {
  showSnackbar: (message: string, severity?: SnackbarSeverity) => void;
}

export const SnackbarContext = createContext<SnackbarContextValue | null>(null);
