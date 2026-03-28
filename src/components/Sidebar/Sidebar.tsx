import type { ReactNode } from 'react';
import AssignmentOutlined from '@mui/icons-material/AssignmentOutlined';
import BarChartOutlined from '@mui/icons-material/BarChartOutlined';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import FlagOutlined from '@mui/icons-material/FlagOutlined';
import LogoutOutlined from '@mui/icons-material/LogoutOutlined';
import MailOutlined from '@mui/icons-material/MailOutlined';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import StarOutlined from '@mui/icons-material/StarOutlined';
import ListItem from '@mui/material/ListItem';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import type { AdminStats } from '@/types';
import sigideLogo from '@/assets/sigide_text_logo.png';
import {
  BadgeStyled,
  LogoImage,
  LogoWrapper,
  NavDivider,
  NavItem,
  NavItemIcon,
  NavItemText,
  NavList,
  SidebarRoot,
} from './Sidebar.styled';

const NAV_ITEMS: {
  label: string;
  path: string;
  icon: ReactNode;
  badgeKey?: 'open_reports' | 'new_contacts_count';
}[] = [
  { label: 'Overview', path: '/', icon: <DashboardOutlined /> },
  { label: 'Users', path: '/users', icon: <PeopleOutlined /> },
  { label: 'Items', path: '/items', icon: <SearchOutlined /> },
  { label: 'Claims', path: '/claims', icon: <AssignmentOutlined /> },
  { label: 'Reports', path: '/reports', icon: <FlagOutlined />, badgeKey: 'open_reports' },
  { label: 'Feedback', path: '/feedback', icon: <StarOutlined /> },
  { label: 'Contact', path: '/contact', icon: <MailOutlined />, badgeKey: 'new_contacts_count' },
  { label: 'Analytics', path: '/analytics', icon: <BarChartOutlined /> },
];

export interface SidebarProps {
  stats?: Pick<AdminStats, 'open_reports' | 'new_contacts_count'>;
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ stats, open, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    onClose?.();
  };

  return (
    <SidebarRoot $open={open}>
      <LogoWrapper>
        <LogoImage src={sigideLogo} alt="Sigide" />
      </LogoWrapper>
      <NavList>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          const count =
            item.badgeKey && stats?.[item.badgeKey] != null && stats[item.badgeKey] > 0
              ? stats[item.badgeKey]
              : undefined;

          const button = (
            <NavItem $active={active} onClick={() => handleNavClick(item.path)}>
              <NavItemIcon>{item.icon}</NavItemIcon>
              <NavItemText primary={item.label} />
            </NavItem>
          );

          return (
            <ListItem key={item.path} disablePadding>
              {count != null ? (
                <BadgeStyled badgeContent={count} color="error">
                  {button}
                </BadgeStyled>
              ) : (
                button
              )}
            </ListItem>
          );
        })}
      </NavList>
      <NavDivider />
      <NavList>
        <ListItem disablePadding>
          <NavItem onClick={handleLogout}>
            <NavItemIcon>
              <LogoutOutlined />
            </NavItemIcon>
            <NavItemText primary="Logout" />
          </NavItem>
        </ListItem>
      </NavList>
    </SidebarRoot>
  );
}
