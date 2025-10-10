'use client'

import { useState } from 'react';
import { TextField, Select, MenuItem, Button } from '@mui/material';
import EmailList from './emailList';
import { TableRowData } from './table';
import { supabase } from '../../../utils/supabase/client';

type prop = {onSuccess: () => void};

export default function NewTracking({ onSuccess }: prop) {
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [reference, setReference] = useState('');
  const [carrier, setCarrier] = useState('');

  const addEmail = () => {
    const trimmed = emailInput.trim();
    if (!trimmed) return;
    if (!emails.includes(trimmed)) setEmails((prev) => [...prev, trimmed]);
    setEmailInput('');
  };

  const removeEmail = (email: string) => {
    setEmails((prev) => prev.filter((e) => e !== email));
  };

  // makes a POST request to the tracking api
  // input: tracking number/order number as a string
  async function createTracking(trackingNumber: string) {
    try{
      const res = await fetch("/api/tracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          "trackingNumber": trackingNumber,
          "carrier": carrier, 
          "emails": emails, 
          "reference": reference
         }),
      });

      const response = await res.json();
      console.log(response);

      // this prolly needs to be in route.ts
      if (response.meta.code === 4101) {
        console.log("Tracking already exists");
        return;
      }

      // call onSuccess to refresh the table
      onSuccess();

      // clear inputs
      setTrackingNumber('');
      setReference('');
      setCarrier('');
      setEmails([]);
      setEmailInput('');
    }
    catch(e) {
      console.error(e);
    }
  }

  const handleCreate = () => {
    createTracking(trackingNumber);
  };

  return (
    <div>
      <TextField
        type="text"
        placeholder="Tracking Number"
        variant="outlined"
        value={trackingNumber}
        onChange={(e) => setTrackingNumber(e.target.value)}
        style={{ width: '100%', padding: '8px' }}
      />

      <TextField
        type="text"
        placeholder="Reference (Optional)"
        variant="outlined"
        value={reference}
        onChange={(e) => setReference(e.target.value)}
        style={{ width: '100%', padding: '8px' }}
      />

      <Select
        displayEmpty
        value={carrier}
        onChange={(e) => setCarrier(e.target.value as string)}
        style={{ width: '100%', padding: '8px', scale: 0.98 }}
      >
        <MenuItem value="" disabled>
          Carrier
        </MenuItem>
        <MenuItem value="fedex">FedEx</MenuItem>
        <MenuItem value="ups">UPS</MenuItem>
        <MenuItem value="dhl">DHL</MenuItem>
        <MenuItem value="usps">USPS</MenuItem>
      </Select>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <TextField
          type="email"
          placeholder="Emails to notify (Optional)"
          variant="outlined"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') addEmail();
          }}
          style={{ flex: 1, padding: '8px' }}
        />
        <Button variant="outlined" onClick={addEmail}>Add</Button>
      </div>

      <EmailList emails={emails} onDelete={removeEmail} />

      <Button variant="contained" onClick={handleCreate} style={{ marginLeft: '10px' }}>
        Create Tracking
      </Button>
    </div>
  );
}
