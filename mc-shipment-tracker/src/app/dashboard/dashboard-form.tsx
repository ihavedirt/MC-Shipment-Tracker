/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

// import BasicTable, { TableRowData }  from '../components/table'
import EnhancedTable, { TableRowData }  from '../components/enhancedTable'
import { Button, Card } from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import NewTracking from '../components/newTracking';

type ApiShipment = {
  id?: string;
  courier_code: string;
  tracking_number: string;
  reference?: string | null;
  est_delivery?: string | null;
  status?: string | null;
  delayed?: boolean | null;
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
          est_delivery: item.est_delivery ? new Date(item.est_delivery).toLocaleDateString() : 'N/A',
          delayed: String(item.delayed) ?? 'N/A',
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
      <div style={{ marginTop: '20px', marginLeft: '20px' }}>
        <Card style={{ width: '70%', padding: "20px", marginTop: "20px" }}>
          <NewTracking onSuccess={fetchAllTrackings}/>
        </Card>

        {/* <Button
          variant='contained'
          style={{ marginRight: '10px', float: 'right' }}
        >
          Preferences
        </Button> */}
      </div>
      <div style={{ marginTop: '20px' }}>
        <EnhancedTable data={tableData} />
      </div>
    </div>
  );
}