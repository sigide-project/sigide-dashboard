import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import type { AdminStats } from '@/types';
import { ContentWrapper, LayoutRoot, MainContent, MobileOverlay } from './Layout.styled';

export interface LayoutProps {
  stats?: Pick<AdminStats, 'open_reports' | 'new_contacts_count'>;
}

export function Layout({ stats }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <LayoutRoot>
      <Sidebar stats={stats} open={sidebarOpen} onClose={handleCloseSidebar} />
      {sidebarOpen && <MobileOverlay onClick={handleCloseSidebar} />}
      <ContentWrapper>
        <TopBar onMenuClick={handleToggleSidebar} />
        <MainContent>
          <Outlet />
        </MainContent>
      </ContentWrapper>
    </LayoutRoot>
  );
}
