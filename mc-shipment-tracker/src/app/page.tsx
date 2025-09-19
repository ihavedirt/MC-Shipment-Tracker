'use client'

import BasicTable, { TableRowData }  from './_components/table'
import { Button, TextField } from '@mui/material';
import { useState } from 'react';

export default function Home() {
  const [currentTrackingNumber, setCurrentTrackingNumber] = useState("");
  const [tableData, setTableData] = useState<TableRowData[]>([]);

  // makes a POST request to the tracking api
  // input: tracking number/order number as a string
  async function sendTrackingNumber(trackingNumber: string) {
    try{
      const res = await fetch("/api/tracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trackingNumber }),
      });

      const response = await res.json();
      console.log(response);

      // convert data to TableRowData[]
      const rows: TableRowData[] = response.data.map(
        (item: any, index: number) => ({
          id: index + 1,
          order_number: item.tracking_number ?? 'N/A',
          carrier: item.carrier_code ?? 'N/A',
          order_date: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A',
          est_arrival_date: item.expected_delivery ? new Date(item.expected_delivery).toLocaleDateString() : 'N/A',
        })
      )

      setTableData(rows);
    }
    catch(e) {
      console.error(e);
    }
  }

  async function fetchAllTrackings() {
    try{
      const res = await fetch("/api/tracking", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await res.json();
      console.log(response);

      // convert data to TableRowData[]
      const rows: TableRowData[] = response.data.map(
        (item: any, index: number) => ({
          id: index + 1,
          order_number: item.tracking_number ?? 'N/A',
          carrier: item.carrier_code ?? 'N/A',
          order_date: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A',
          est_arrival_date: item.expected_delivery ? new Date(item.expected_delivery).toLocaleDateString() : 'N/A',
        })
      )

      setTableData(rows);
    }
    catch(e) {
      console.error(e);
    }
  }

  return (
    <div>
      <div style={{ marginTop: '20px', marginLeft: '20px' }}>
        <TextField 
          label="Tracking No." 
          variant="outlined" 
          value={currentTrackingNumber}
          onChange={(e) => setCurrentTrackingNumber(e.target.value)}
        />
        <Button 
          variant='contained'
          onClick={() => sendTrackingNumber(currentTrackingNumber)}
          style={{ marginLeft: '10px' }}
        >
          Create Tracking
        </Button>

        <Button
          variant='contained'
          onClick={() => fetchAllTrackings()}
          style={{ marginRight: '10px', float: 'right' }}
        >
          Get all Trackings
        </Button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <BasicTable data={tableData} />
      </div>
    </div>
  );
}