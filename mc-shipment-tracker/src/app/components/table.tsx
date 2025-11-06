'use client'

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export type TableRowData = {
  tracking_number: string;
  reference: string;
  courier_code: string;
  est_delivery: string;
  delayed: string;
  delivered: string;
};

export default function BasicTable({ data }: { data: TableRowData[] }) {
  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <TableContainer component={Paper} sx={{ maxHeight: '700px' }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>No.</TableCell>
            <TableCell align="right">Tracking Number</TableCell>
            <TableCell align="right">Reference</TableCell>
            <TableCell align="right">Courier</TableCell>
            <TableCell align="right">Est. Delivery</TableCell>
            <TableCell align="right">Delayed</TableCell>
            <TableCell align="right">Delivered</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {index}
              </TableCell>
              <TableCell align="right">{row.tracking_number}</TableCell>
              <TableCell align="right">{row.reference}</TableCell>
              <TableCell align="right">{row.courier_code}</TableCell>
              <TableCell align="right">{row.est_delivery}</TableCell>
              <TableCell align="right">{row.delayed}</TableCell>
              <TableCell align="right">{row.delivered}</TableCell>
              <TableCell align="right">
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}