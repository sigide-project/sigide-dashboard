import MenuIcon from '@mui/icons-material/Menu';
import { useLocation } from 'react-router-dom';
import { AdminAvatar } from '@/components/AdminAvatar';
import {
  HamburgerButton,
  PageTitle,
  TopBarRoot,
  TopBarToolbar,
  LeftSection,
} from './TopBar.styled';

const PATH_TITLE_MAP: Record<string, string> = {
  '/': 'Overview',
  '/users': 'Users',
  '/items': 'Items',
  '/claims': 'Claims',
  '/reports': 'Reports',
  '/feedback': 'Feedback',
  '/contact': 'Contact',
  '/analytics': 'Analytics',
};

function titleFromPath(pathname: string): string {
  if (PATH_TITLE_MAP[pathname]) {
    return PATH_TITLE_MAP[pathname];
  }
  const base = `/${pathname.split('/').filter(Boolean)[0] ?? ''}`;
  return PATH_TITLE_MAP[base] ?? 'Dashboard';
}

export interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const location = useLocation();
  const title = titleFromPath(location.pathname);

  return (
    <TopBarRoot position="fixed" elevation={0}>
      <TopBarToolbar>
        <LeftSection>
          <HamburgerButton onClick={onMenuClick} aria-label="Open navigation menu">
            <MenuIcon />
          </HamburgerButton>
          <PageTitle>{title}</PageTitle>
        </LeftSection>
        <AdminAvatar />
      </TopBarToolbar>
    </TopBarRoot>
  );
}
