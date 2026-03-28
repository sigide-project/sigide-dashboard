import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import { NotFoundCode, NotFoundRoot, NotFoundText } from './NotFoundPage.styled';

export function NotFoundPage() {
  return (
    <NotFoundRoot>
      <NotFoundCode>404</NotFoundCode>
      <NotFoundText>Page not found</NotFoundText>
      <Button component={RouterLink} to="/" variant="contained" color="primary" size="large">
        Go to Dashboard
      </Button>
    </NotFoundRoot>
  );
}
