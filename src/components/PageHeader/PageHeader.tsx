import type { ReactNode } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import { HeaderRoot, LeftColumn, Title } from './PageHeader.styled';

export interface PageHeaderBreadcrumb {
  label: string;
  href?: string;
}

export interface PageHeaderAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
}

export interface PageHeaderProps {
  title: string;
  breadcrumbs?: PageHeaderBreadcrumb[];
  action?: PageHeaderAction;
}

export function PageHeader({ title, breadcrumbs, action }: PageHeaderProps) {
  return (
    <HeaderRoot>
      <LeftColumn>
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <Breadcrumbs aria-label="breadcrumb">
            {breadcrumbs.map((crumb, i) =>
              crumb.href ? (
                <Link
                  key={`${crumb.label}-${i}`}
                  component={RouterLink}
                  to={crumb.href}
                  color="inherit"
                  underline="hover"
                >
                  {crumb.label}
                </Link>
              ) : (
                <Typography key={`${crumb.label}-${i}`} color="text.secondary">
                  {crumb.label}
                </Typography>
              ),
            )}
          </Breadcrumbs>
        ) : null}
        <Title>{title}</Title>
      </LeftColumn>
      {action ? (
        <Button
          variant="contained"
          color="primary"
          startIcon={action.icon}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      ) : null}
    </HeaderRoot>
  );
}
