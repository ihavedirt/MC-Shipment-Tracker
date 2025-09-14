'use client'

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

type Row = {
  id: number;
  order_number: string;
  carrier: string;
  order_date: string;
  est_arrival_date: string;
}

//{ data }: { data: Row[] }
export default function BasicTable() {
  /*if (!data || data.length === 0) {
    return <div>No data available</div>;
  }*/

  return (
    <TableContainer component={Paper} sx={{ maxHeight: '700px' }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>No.</TableCell>
            <TableCell align="right">Order Number</TableCell>
            <TableCell align="right">Carrier</TableCell>
            <TableCell align="right">Order Date</TableCell>
            <TableCell align="right">Est. Arrival Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.order_number}</TableCell>
              <TableCell align="right">{row.carrier}</TableCell>
              <TableCell align="right">{row.order_date}</TableCell>
              <TableCell align="right">{row.est_arrival_date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const tableData = [{
  "id": 1,
  "order_number": "065403875",
  "carrier": "Wolf-Rau",
  "order_date": "10/24/2025",
  "est_arrival_date": "9/22/2024"
}, {
  "id": 2,
  "order_number": "111907652",
  "carrier": "Leuschke Group",
  "order_date": "4/14/2025",
  "est_arrival_date": "3/22/2025"
}, {
  "id": 3,
  "order_number": "242272188",
  "carrier": "Bergstrom, McGlynn and Veum",
  "order_date": "8/3/2025",
  "est_arrival_date": "8/23/2025"
}, {
  "id": 4,
  "order_number": "067015258",
  "carrier": "Nitzsche Inc",
  "order_date": "1/22/2025",
  "est_arrival_date": "2/22/2025"
}, {
  "id": 5,
  "order_number": "021300381",
  "carrier": "Altenwerth Group",
  "order_date": "9/16/2025",
  "est_arrival_date": "6/13/2025"
}, {
  "id": 6,
  "order_number": "071106250",
  "carrier": "D'Amore and Sons",
  "order_date": "8/1/2025",
  "est_arrival_date": "4/10/2025"
}, {
  "id": 7,
  "order_number": "082901677",
  "carrier": "Schaefer, Halvorson and Bosco",
  "order_date": "10/20/2025",
  "est_arrival_date": "12/14/2024"
}, {
  "id": 8,
  "order_number": "075000051",
  "carrier": "Walker-Douglas",
  "order_date": "3/22/2025",
  "est_arrival_date": "10/3/2024"
}, {
  "id": 9,
  "order_number": "072407123",
  "carrier": "Schmidt Group",
  "order_date": "9/22/2024",
  "est_arrival_date": "12/28/2025"
}, {
  "id": 10,
  "order_number": "122238611",
  "carrier": "Labadie, Hayes and Bahringer",
  "order_date": "8/13/2025",
  "est_arrival_date": "12/15/2024"
}, {
  "id": 11,
  "order_number": "122238611",
  "carrier": "Labadie, Hayes and Bahringer",
  "order_date": "8/13/2025",
  "est_arrival_date": "12/15/2024"
}, {
  "id": 12,
  "order_number": "122238611",
  "carrier": "Labadie, Hayes and Bahringer",
  "order_date": "8/13/2025",
  "est_arrival_date": "12/15/2024"
}, {
  "id": 13,
  "order_number": "122238611",
  "carrier": "Labadie, Hayes and Bahringer",
  "order_date": "8/13/2025",
  "est_arrival_date": "12/15/2024"
}, {
  "id": 14,
  "order_number": "122238611",
  "carrier": "Labadie, Hayes and Bahringer",
  "order_date": "8/13/2025",
  "est_arrival_date": "12/15/2024"
}];