import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import theme from '@/theme';
import { SnackbarProvider } from '@/components/AppSnackbar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Layout } from '@/components/Layout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { UsersPage } from '@/pages/UsersPage';
import { UserDetailPage } from '@/pages/UserDetailPage';
import { ItemsPage } from '@/pages/ItemsPage';
import { ItemDetailPage } from '@/pages/ItemDetailPage';
import { ClaimsPage } from '@/pages/ClaimsPage';
import { ClaimDetailPage } from '@/pages/ClaimDetailPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { FeedbackPage } from '@/pages/FeedbackPage';
import { ContactPage } from '@/pages/ContactPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MuiThemeProvider theme={theme}>
        <SCThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route element={<Layout />}>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/users/:id" element={<UserDetailPage />} />
                    <Route path="/items" element={<ItemsPage />} />
                    <Route path="/items/:id" element={<ItemDetailPage />} />
                    <Route path="/claims" element={<ClaimsPage />} />
                    <Route path="/claims/:id" element={<ClaimDetailPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/feedback" element={<FeedbackPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                  </Route>
                </Route>
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
          </SnackbarProvider>
        </SCThemeProvider>
      </MuiThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
