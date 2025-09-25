/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import BasicTable, { TableRowData }  from './components/table'
import { Button, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase/client';

export default function Home() {
  const [currentTrackingNumber, setCurrentTrackingNumber] = useState("");
  const [tableData, setTableData] = useState<TableRowData[]>([]);
  const [session, setSession] = useState<any>(null);

  const fetchSession = async () => {
    const currentSession = await supabase.auth.getSession();
    setSession(currentSession.data)
  }

  useEffect(() => {
    fetchSession();
  }, []);
  
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
          tracking_number: item.tracking_number ?? 'N/A',
          carrier: item.courier_code ?? 'N/A',
          est_delivery: item.scheduled_delivery_date ? new Date(item.scheduled_delivery_date).toLocaleDateString() : 'N/A',
          delivered: item.delivered ?? 'N/A',
          delayed: item.delayed ?? 'N/A'
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
          tracking_number: item.tracking_number ?? 'N/A',
          carrier: item.courier_code ?? 'N/A',
          est_delivery: item.scheduled_delivery_date ? new Date(item.scheduled_delivery_date).toLocaleDateString() : 'N/A',
          delivered: item.delivered ?? 'N/A',
          delayed: item.delayed ?? 'N/A'
          // if item.delivery_status == 'delivered' or 'delayed'
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
          style={{ marginLeft: '10px', background: '#4c42a0ff' }}
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