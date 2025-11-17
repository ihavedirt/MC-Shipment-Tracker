'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import EmailList from './emailList';

export default function NewTracking({ onSuccess }: { onSuccess: () => void }) {
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

  async function createTracking(trackingNumber: string) {
    try {
      const res = await fetch('/api/tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trackingNumber,
          carrier,
          emails,
          reference,
        }),
      });

      console.log(res);

      onSuccess();

      setTrackingNumber('');
      setReference('');
      setCarrier('');
      setEmails([]);
      setEmailInput('');
    } catch (e) {
      console.error(e);
    }
  }

  const handleCreate = () => {
    createTracking(trackingNumber);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        width: '100%'
      }}
    >
      <CardHeader
        title="New Tracking"
        subheader="Create a tracked shipment and set who gets notified"
      />

      <CardContent>
        <Stack spacing={3}>
          {/* Tracking + reference */}
          <Stack spacing={1.5}>
            <TextField
              label="Tracking number"
              variant="outlined"
              size="small"
              fullWidth
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
            <TextField
              label="Reference (optional)"
              variant="outlined"
              size="small"
              fullWidth
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </Stack>

          {/* Carrier select */}
          <FormControl fullWidth size="small">
            <InputLabel id="carrier-label">Carrier</InputLabel>
            <Select
              labelId="carrier-label"
              label="Carrier"
              value={carrier}
              onChange={(e) => setCarrier(e.target.value as string)}
            >
              <MenuItem value="fedex">FedEx</MenuItem>
              <MenuItem value="ups">UPS</MenuItem>
              <MenuItem value="dhl">DHL</MenuItem>
              <MenuItem value="usps">USPS</MenuItem>
              <MenuItem value="shippo">Shippo</MenuItem>
            </Select>
          </FormControl>

          {/* Emails */}
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              Emails to notify (optional)
            </Typography>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <TextField
                type="email"
                placeholder="Add email"
                variant="outlined"
                size="small"
                fullWidth
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addEmail();
                }}
              />
              <Button variant="outlined" onClick={addEmail}>
                Add
              </Button>
            </Stack>

            <EmailList emails={emails} onDelete={removeEmail} />
          </Stack>

          {/* Submit */}
          <Stack direction="row" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={!trackingNumber || !carrier}
            >
              Create tracking
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
