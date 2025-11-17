'use client';

import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Chip } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import TrackingEditor from './trackingEditor';
import BulkDeleteConfirmation from './bulkDeleteConfirm';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PRE_TRANSIT':
      return { backgroundColor: '#BBDEFB', color: '#000000ff' };
    case 'TRANSIT':
      return { backgroundColor: '#1976D2', color: '#000000ff' };
    case 'DELIVERED':
      return { backgroundColor: '#2E7D32', color: '#000000ff' };
    case 'RETURNED':
      return { backgroundColor: '#E57373', color: '#000000ff' };
    case 'FAILURE':
      return { backgroundColor: '#C62828', color: '#000000ff' };
    case 'UNKNOWN':
      return { backgroundColor: '#BDBDBD', color: '#000000ff' };
    default:
      return { backgroundColor: '#BDBDBD', color: '#000000ff' };
  }
}

export interface TableRowData {
  tracking_number: string;
  reference: string;
  courier_code: string;
  eta: string;
  status: string;
  delay_status: string;
  emails?: string[];
}

type Order = 'asc' | 'desc';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  const av = String((a as any)[orderBy] ?? '');
  const bv = String((b as any)[orderBy] ?? '');
  if (bv < av) return -1;
  if (bv > av) return 1;
  return 0;
}

function getComparator<T>(order: Order, orderBy: keyof T): (a: T, b: T) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator<T>(a, b, orderBy)
    : (a, b) => -descendingComparator<T>(a, b, orderBy);
}


interface HeadCell {
  id: keyof TableRowData | 'index' | 'selector' | 'actions';
  label: string;
  numeric?: boolean;
  sortable?: boolean;
}

const headCells: readonly HeadCell[] = [
  { id: 'selector', label: '', sortable: false },
  { id: 'index', label: 'No.', numeric: true, sortable: false },
  { id: 'tracking_number', label: 'Tracking Number', sortable: true },
  { id: 'reference', label: 'Reference', sortable: true },
  { id: 'courier_code', label: 'Courier', sortable: true },
  { id: 'eta', label: 'Est. Delivery', sortable: true },
  { id: 'status', label: 'Status', sortable: true },
  { id: 'delay_status', label: 'Delay Status', sortable: true },
  { id: 'actions', label: '', sortable: false },
];

interface EnhancedTableHeadProps {
  order: Order;
  orderBy: keyof TableRowData;
  onRequestSort: (e: React.MouseEvent<unknown>, property: keyof TableRowData) => void;
  numSelected: number;
  rowCount: number;
  onSelectAllClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function EnhancedTableHead(props: EnhancedTableHeadProps) {
  const { order, orderBy, onRequestSort, numSelected, rowCount, onSelectAllClick } = props;
  const createSortHandler =
    (property: keyof TableRowData) => (event: React.MouseEvent<unknown>) =>
      onRequestSort(event, property);

  return (
    <TableHead>
      <TableRow>
        {/* select-all */}
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all rows' }}
          />
        </TableCell>

        {headCells.slice(1).map((h) => {
          if (!h.sortable || h.id === 'index' || h.id === 'actions') {
            return <TableCell key={h.id} align={h.numeric ? 'right' : 'left'}>{h.label}</TableCell>;
          }
          const id = h.id as keyof TableRowData;
          return (
            <TableCell key={h.id} sortDirection={orderBy === id ? order : false}>
              <TableSortLabel
                active={orderBy === id}
                direction={orderBy === id ? order : 'asc'}
                onClick={createSortHandler(id)}
              >
                {h.label}
                {orderBy === id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar({ numSelected, selected, onSuccess }: { numSelected: number, selected: readonly string[], onSuccess: () => void }) {
  const [bulkDeleteConfirmationOpen, setBulkDeleteConfirmationOpen] = React.useState(false);

  const onOpenBulkDeleteConfirmation = () => {
    setBulkDeleteConfirmationOpen(true);
  }

  const onCloseBulkDeleteConfirmation = () => {
    setBulkDeleteConfirmationOpen(false);
    
  }

  return (
    <Toolbar
      sx={[
        { pl: { sm: 2 }, pr: { xs: 1, sm: 1 } },
        numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} variant="h6">
          Shipments
        </Typography>
      )}

      <Tooltip title="Delete selected">
        <IconButton 
          aria-label="delete selected" 
          onClick={(e) => onOpenBulkDeleteConfirmation()} 
          disabled={numSelected === 0}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>

      <BulkDeleteConfirmation
        open={bulkDeleteConfirmationOpen}
        onClose={onCloseBulkDeleteConfirmation}
        selectedRows={selected}
        onSuccess={onSuccess}
      />
    </Toolbar>
  );
}

export default function BasicTable({ data, onSuccess }: { data: TableRowData[], onSuccess: () => void }) {
  const safeData = Array.isArray(data) ? data : [];
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof TableRowData>('tracking_number');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState<readonly string[]>([]); // track by tracking_number
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editorRow, setEditorRow] = React.useState<TableRowData | null>(null);

  // When a bulk delete succeeds, refresh data and clear selection
  const handleBulkDeleteSuccess = React.useCallback(() => {
    onSuccess();
    setSelected([]);
  }, [onSuccess]);

  const onOpenRowMenu = (row: TableRowData) => {
    setEditorRow(row);
    setEditorOpen(true);
  };

  const onCloseRowMenu = () => {
    setEditorOpen(false);
    setEditorRow(null);
  };


  const handleRequestSort = (_e: React.MouseEvent<unknown>, property: keyof TableRowData) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected(safeData.map((r) => r.tracking_number));
    } else {
      setSelected([]);
    }
  };

  const handleRowToggle = (_e: React.MouseEvent<unknown>, key: string) => {
    const idx = selected.indexOf(key);
    if (idx === -1) setSelected((prev) => [...prev, key]);
    else setSelected((prev) => [...prev.slice(0, idx), ...prev.slice(idx + 1)]);
  };

  const isSelected = (key: string) => selected.indexOf(key) !== -1;

  const handleChangePage = (_e: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // Reconcile selection whenever table data changes (remove keys that no longer exist)
  React.useEffect(() => {
    const keys = new Set(safeData.map((r) => r.tracking_number));
    setSelected((prev) => prev.filter((k) => keys.has(k)));
  }, [safeData]);

  const visibleRows = React.useMemo(
    () =>
      [...safeData]
        .sort(getComparator<TableRowData>(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [safeData, order, orderBy, page, rowsPerPage]
  );

  if (!safeData.length) return <div>No data available</div>;

  const startIndex = page * rowsPerPage;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} selected={selected} onSuccess={handleBulkDeleteSuccess} />

        <TableContainer sx={{ maxHeight: 700 }}>
          <Table stickyHeader sx={{ minWidth: 750 }} size={'small'}>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              numSelected={selected.length}
              rowCount={safeData.length}
              onSelectAllClick={handleSelectAllClick}
            />

            <TableBody>
              {visibleRows.map((row, idx) => {
                const key = row.tracking_number || `row-${startIndex + idx}`;
                const checked = isSelected(key);
                const labelId = `enhanced-table-checkbox-${startIndex + idx}`;

                return (
                  <TableRow
                    hover
                    onClick={(e) => handleRowToggle(e, key)}
                    role="checkbox"
                    aria-checked={checked}
                    tabIndex={-1}
                    key={key}
                    selected={checked}
                    sx={{ cursor: 'pointer' }}
                  >
                    {/* Row checkbox */}
                    <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        color="primary"
                        checked={checked}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleRowToggle(e as unknown as React.MouseEvent, key);
                        }}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </TableCell>

                    {/* No. */}
                    <TableCell align="right">{startIndex + idx}</TableCell>

                    <TableCell component="th" id={labelId} scope="row">
                      {row.tracking_number}
                    </TableCell>
                    <TableCell align="left">{row.reference}</TableCell>
                    <TableCell align="left">{row.courier_code}</TableCell>
                    <TableCell align="left">{row.eta}</TableCell>
                    <TableCell align="left">
                      <Chip label={row.status} sx={getStatusColor(row.status)} />
                    </TableCell>
                    <TableCell align="left">{row.delay_status}</TableCell>

                    {/* Actions (3 dots) */}
                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      <IconButton
                        aria-label="row actions"
                        onClick={(e) => onOpenRowMenu(row)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 10, 25, 50]}
          count={safeData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <TrackingEditor
        open={editorOpen}
        onClose={onCloseRowMenu}
        row={editorRow}
        onSuccess={onSuccess}
      />
    </Box>
  );
}
