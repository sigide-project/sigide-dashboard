import CircularProgress from '@mui/material/CircularProgress';
import { SpinnerRoot } from './LoadingSpinner.styled';

export interface LoadingSpinnerProps {
  size?: number;
}

export function LoadingSpinner({ size = 40 }: LoadingSpinnerProps) {
  return (
    <SpinnerRoot>
      <CircularProgress color="primary" size={size} />
    </SpinnerRoot>
  );
}
