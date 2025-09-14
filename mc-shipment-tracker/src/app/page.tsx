'use client'

import BasicTable from './_components/table'
import { Button, TextField } from '@mui/material';
import { useState } from 'react';

export default function Home() {
  const [currentTrackingNumber, setCurrentTrackingNumber] = useState("");
  const [tableData, setTableData] = useState("");


  async function sendTrackingNumber(trackingNumber: string) {
    const res = await fetch("/api/tracking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ trackingNumber }),
    });

    const data = await res.json();
    console.log(data);
    setTableData(data);
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
          Submit
        </Button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <BasicTable/>
      </div>
    </div>
  );
}