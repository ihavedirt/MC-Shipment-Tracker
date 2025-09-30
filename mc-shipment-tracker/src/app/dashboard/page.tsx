/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import BasicTable, { TableRowData }  from '../components/table'
import { Button, Card } from '@mui/material';
import { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabase/client';
import NewTracking from '../components/newTracking';

export default function Dashboard() {
  const [tableData, setTableData] = useState<TableRowData[]>([]);
  const [session, setSession] = useState<any>(null);

  // fetches the current session from supabase
  const fetchSession = async () => {
    const currentSession = await supabase.auth.getSession();
    console.log(currentSession);
    setSession(currentSession.data.session)
  }

  useEffect(() => {
    fetchSession();
    fetchAllTrackings();
  }, []);

  // makes a GET request to the tracking api to fetch all tracking created
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
        <Card style={{ width: '70%', padding: "20px", marginTop: "20px" }}>
          <NewTracking onSuccess={fetchAllTrackings}/>
        </Card>

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