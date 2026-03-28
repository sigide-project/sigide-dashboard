import ExpandLessOutlined from '@mui/icons-material/ExpandLessOutlined';
import ExpandMoreOutlined from '@mui/icons-material/ExpandMoreOutlined';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { isAxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import type { MouseEvent } from 'react';
import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  BodyCell,
  BodyRow,
  HeaderCell,
  HeaderRow,
  LoadingOverlay,
  StyledTable,
  TableWrapper,
} from '@/components/DataTable/DataTable.styled';
import { EmptyState, LoadingSpinner, PageHeader } from '@/components';
import { contactService } from '@/services';
import type { ContactMessage } from '@/types';
import { exportToCsv, formatDate } from '@/utils';
import {
  ActionsCell,
  ContactRoot,
  ExpandedContent,
  ExpandedMessage,
  ExpandedSubject,
  FilterSelect,
  FiltersBar,
  MessageCell,
  SearchField,
  SubjectCell,
  UserLink,
} from './ContactPage.styled';

type SortOption = 'newest' | 'oldest';

interface ContactListData {
  messages: ContactMessage[];
  total: number;
  page: number;
  pages: number;
}

function sortParams(sort: SortOption): { sort: string; order: 'asc' | 'desc' } {
  if (sort === 'oldest') {
    return { sort: 'created_at', order: 'asc' };
  }
  return { sort: 'created_at', order: 'desc' };
}

const COL_COUNT = 7;

export function ContactPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(search), 400);
    return () => window.clearTimeout(t);
  }, [search]);

  const sp = useMemo(() => sortParams(sort), [sort]);

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ['admin', 'contact', page, rowsPerPage, debouncedSearch, sort],
    queryFn: () =>
      contactService.getAll({
        page: page + 1,
        limit: rowsPerPage,
        search: debouncedSearch.trim() || undefined,
        sort: sp.sort,
        order: sp.order,
      }) as Promise<ContactListData>,
  });

  const rows = data?.messages ?? [];
  const total = data?.total ?? 0;
  const tableLoading = isLoading || isFetching;

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const exportContacts = () => {
    exportToCsv(
      'contact-messages',
      rows.map((c) => ({
        name: c.name,
        email: c.email,
        subject: c.subject,
        message: c.message,
        submitted: formatDate(c.createdAt),
      })),
    );
  };

  const handlePageChange = (_: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(0);
  };

  if (isLoading && !data) {
    return <LoadingSpinner />;
  }

  if (isError) {
    const msg = isAxiosError(error) ? error.message : 'Failed to load messages';
    return (
      <ContactRoot>
        <PageHeader title="Contact messages" />
        <Typography color="error">{msg}</Typography>
      </ContactRoot>
    );
  }

  const showEmpty = !tableLoading && rows.length === 0;

  return (
    <ContactRoot>
      <PageHeader
        title="Contact messages"
        action={{
          label: 'Export CSV',
          icon: <FileDownloadOutlined />,
          onClick: exportContacts,
        }}
      />
      <FiltersBar>
        <SearchField
          placeholder="Search name or subject"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <FilterSelect size="small">
          <InputLabel id="contact-sort-filter">Sort</InputLabel>
          <Select
            labelId="contact-sort-filter"
            label="Sort"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as SortOption);
              setPage(0);
            }}
          >
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
          </Select>
        </FilterSelect>
      </FiltersBar>

      <Paper variant="outlined">
        <TableWrapper>
          {tableLoading ? (
            <LoadingOverlay>
              <CircularProgress color="primary" />
            </LoadingOverlay>
          ) : null}
          {showEmpty ? (
            <EmptyState message="No contact messages" />
          ) : (
            <TableContainer>
              <StyledTable stickyHeader size="medium">
                <TableHead>
                  <HeaderRow>
                    <HeaderCell>Name</HeaderCell>
                    <HeaderCell>Email</HeaderCell>
                    <HeaderCell>Subject</HeaderCell>
                    <HeaderCell>Message</HeaderCell>
                    <HeaderCell>Submitted</HeaderCell>
                    <HeaderCell>User</HeaderCell>
                    <HeaderCell $width={80}>Actions</HeaderCell>
                  </HeaderRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <Fragment key={row.id}>
                      <BodyRow>
                        <BodyCell>{row.name}</BodyCell>
                        <BodyCell>{row.email}</BodyCell>
                        <BodyCell>
                          <SubjectCell>
                            {row.subject.length > 60 ? `${row.subject.slice(0, 60)}…` : row.subject}
                          </SubjectCell>
                        </BodyCell>
                        <BodyCell>
                          <MessageCell>
                            {row.message.length > 80 ? `${row.message.slice(0, 80)}…` : row.message}
                          </MessageCell>
                        </BodyCell>
                        <BodyCell>{formatDate(row.createdAt)}</BodyCell>
                        <BodyCell>
                          {row.user_id ? (
                            <UserLink to={`/users/${row.user_id}`}>Profile</UserLink>
                          ) : (
                            'Guest'
                          )}
                        </BodyCell>
                        <BodyCell $width={80}>
                          <ActionsCell>
                            <IconButton
                              size="small"
                              aria-label={expanded.has(row.id) ? 'Collapse' : 'Expand'}
                              onClick={() => toggleExpand(row.id)}
                            >
                              {expanded.has(row.id) ? (
                                <ExpandLessOutlined fontSize="small" />
                              ) : (
                                <ExpandMoreOutlined fontSize="small" />
                              )}
                            </IconButton>
                          </ActionsCell>
                        </BodyCell>
                      </BodyRow>
                      {expanded.has(row.id) ? (
                        <TableRow key={`${row.id}-exp`}>
                          <TableCell colSpan={COL_COUNT}>
                            <ExpandedMessage>
                              <ExpandedSubject variant="subtitle1">{row.subject}</ExpandedSubject>
                              <ExpandedContent variant="body2">{row.message}</ExpandedContent>
                            </ExpandedMessage>
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </Fragment>
                  ))}
                </TableBody>
              </StyledTable>
            </TableContainer>
          )}
          {!showEmpty ? (
            <TablePagination
              component="div"
              count={total}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          ) : null}
        </TableWrapper>
      </Paper>
    </ContactRoot>
  );
}
