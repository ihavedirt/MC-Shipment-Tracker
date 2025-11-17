/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

// import BasicTable, { TableRowData }  from '../components/table'
import EnhancedTable, { TableRowData }  from '../components/enhancedTable'
import { Box, Button, Card, Grid } from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import NewTracking from '../components/newTracking';
import EmailNoficationEditor from '../components/emailNoficationEditor';

type ApiShipment = {
  id?: string;
  courier_code: string;
  tracking_number: string;
  reference?: string | null;
  eta?: string | null;
  status?: string | null;
  delay_status?: boolean | null;
  emails?: string[] | null;
  created_at?: string;
};

export default function DashboardForm() {
  const [tableData, setTableData] = useState<TableRowData[]>([]);
  const [loading, setLoading] = useState(false);

  // makes a GET request to the tracking api to fetch all tracking created
  const fetchAllTrackings = useCallback( async () => {
    setLoading(true);
    try{
      const res = await fetch("/api/tracking", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: 'no-store'
      });

      if (!res.ok) {
        console.log("Something went wrong with GET for table");
      }

      const response = await res.json();

      // safety incase api give some weirdo stuff
      // this will set item to empty array if response was something unexpected
      const item : ApiShipment[] = Array.isArray(response?.data) ? response.data : [];

      // convert data to TableRowData[]
      const rows: TableRowData[] = item.map(
        (item, index) => ({
          id: index + 1,
          tracking_number: item.tracking_number ?? 'N/A',
          reference: item.reference ?? 'N/A',
          courier_code: item.courier_code ?? 'N/A',
          eta: item.eta ? new Date(item.eta).toLocaleDateString() : 'N/A',
          delay_status: String(item.delay_status) ?? 'N/A',
          status: String(item.status) ?? 'N/A',
          emails: item.emails ?? [],
        })
      );

      setTableData(rows);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllTrackings();
  }, []);

  return (
    <div>
      <Box sx={{ p: 3, width: '100%' }}>
        <Grid container spacing={2}>
          
          <Grid size={8}>
            <NewTracking onSuccess={fetchAllTrackings} />
          </Grid>

          <Grid size={4}>
            <EmailNoficationEditor />
          </Grid>

        </Grid>
      </Box>
      <div style={{ marginTop: '20px' }}>
        <EnhancedTable data={tableData} onSuccess={fetchAllTrackings} />
      </div>
    </div>
  );
}