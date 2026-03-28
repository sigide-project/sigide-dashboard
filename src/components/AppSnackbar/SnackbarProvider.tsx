import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AppSnackbar } from './AppSnackbar';
import { SnackbarContext, type SnackbarSeverity } from './snackbar-context';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
}

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSnackbar = useCallback((message: string, severity: SnackbarSeverity = 'success') => {
    setState({ open: true, message, severity });
  }, []);

  const handleClose = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const value = useMemo(() => ({ showSnackbar }), [showSnackbar]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <AppSnackbar
        open={state.open}
        message={state.message}
        severity={state.severity}
        onClose={handleClose}
      />
    </SnackbarContext.Provider>
  );
}
