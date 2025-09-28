'use client'

import { useState } from 'react';
import { TextField, Select, MenuItem, Button } from '@mui/material';
import EmailList from './emailList';

export default function NewTracking() {
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

  const handleCreate = () => {
    // TODO: submit { trackingNumber, reference, carrier, emails }
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

      {/* Use MUI Select with MenuItem (recommended) */}
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
