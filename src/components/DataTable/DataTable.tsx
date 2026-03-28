import type { ChangeEvent, MouseEvent } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import { EmptyState } from '@/components/EmptyState';
import type { Column } from '@/types';
import {
  BodyCell,
  BodyRow,
  HeaderCell,
  HeaderRow,
  LoadingOverlay,
  StyledTable,
  TableWrapper,
} from './DataTable.styled';

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  isLoading: boolean;
  total: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  emptyMessage?: string;
}

function cellValue<T>(row: T, column: Column<T>): string {
  if (column.render) {
    return '';
  }
  const v = (row as Record<string, unknown>)[column.key];
  if (v == null) {
    return '';
  }
  return String(v);
}

export function DataTable<T>({
  columns,
  rows,
  isLoading,
  total,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  emptyMessage,
}: DataTableProps<T>) {
  const handlePageChange = (_: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    onPageChange(newPage);
  };

  const handleRowsPerPageChange = (e: ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(Number(e.target.value));
  };

  const showEmpty = !isLoading && rows.length === 0;

  return (
    <Paper variant="outlined">
      <TableWrapper>
        {isLoading ? (
          <LoadingOverlay>
            <CircularProgress color="primary" />
          </LoadingOverlay>
        ) : null}
        {showEmpty ? (
          <EmptyState message={emptyMessage} />
        ) : (
          <TableContainer>
            <StyledTable stickyHeader size="medium">
              <TableHead>
                <HeaderRow>
                  {columns.map((col) => (
                    <HeaderCell key={col.key} $width={col.width}>
                      {col.label}
                    </HeaderCell>
                  ))}
                </HeaderRow>
              </TableHead>
              <TableBody>
                {rows.map((row, rowIndex) => (
                  <BodyRow key={rowIndex}>
                    {columns.map((col) => (
                      <BodyCell key={col.key} $width={col.width}>
                        {col.render ? col.render(row) : cellValue(row, col)}
                      </BodyCell>
                    ))}
                  </BodyRow>
                ))}
              </TableBody>
            </StyledTable>
          </TableContainer>
        )}
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableWrapper>
    </Paper>
  );
}
