// components/TrackingEditor.tsx
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Button,
  Stack,
  FormHelperText,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { TableRowData } from './enhancedTable';
import EmailList from './emailList';

export type Props = {
  open: boolean;
  onClose: () => void;
  row?: TableRowData | null;
  onSuccess: () => void;
};

export default function TrackingEditor({ open, onClose, row, onSuccess }: Props) {
  const [reference, setReference] = React.useState('');
  const [emails, setEmails] = React.useState<string[]>([]);
  const [emailInput, setEmailInput] = React.useState('');
  const [emailError, setEmailError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!row) {
      setReference('');
      setEmails([]);
      setEmailInput('');
      setEmailError(null);
      return;
    }
    setReference(row.reference ?? '');
    setEmails([...new Set((row.emails ?? []).map((e) => e.trim()).filter(Boolean))]);
    setEmailInput('');
    setEmailError(null);
  }, [row, open]);

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const addEmail = () => {
    const raw = emailInput.trim();
    if (!raw) return;

    const candidates = raw.split(/[,\s]+/).map((s) => s.trim()).filter(Boolean);
    const invalid = candidates.filter((c) => !emailRe.test(c));
    if (invalid.length) {
      setEmailError(`Invalid email${invalid.length > 1 ? 's' : ''}: ${invalid.join(', ')}`);
      return;
    }

    const currentLower = new Set(emails.map((e) => e.toLowerCase()));
    const next = [
      ...emails,
      ...candidates.filter((c) => !currentLower.has(c.toLowerCase())),
    ];

    setEmails(next);
    setEmailInput('');
    setEmailError(null);
  };

  const removeEmail = (email: string) => {
    setEmails((prev) => prev.filter((e) => e !== email));
  };

  const handleSubmit = async () => {
    if (!row) return;

    const payload = {
      tracking_number: row.tracking_number,
      courier_code: row.courier_code,
      reference: reference.trim(),
      emails,
    };

    console.log('TrackingEditor submit:', payload);
    onClose();
    onSuccess();
  };

  const handleDelete = async () => {
    if (!row) return;
    console.log("delete called");

    try {
      const res = await fetch("/api/tracking", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "trackingNumber": row.tracking_number,
        })
      });

      if (!res.ok) {
        console.error("Delete failed");
      }
    } catch (e) {
      console.error(e);
    } finally {
      onClose();
      onSuccess();
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ pr: 6 }}>
        Edit Tracking
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            label="Tracking Number"
            value={row?.tracking_number ?? ''}
            fullWidth
            disabled
          />
          <TextField
            label="Carrier"
            value={row?.courier_code ?? ''}
            fullWidth
            disabled
          />
          <TextField
            label="Reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            fullWidth
            placeholder="Add a reference"
          />

          {/* Email editor UI */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <TextField
              type="email"
              placeholder="Emails to notify (Optional)"
              variant="outlined"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addEmail();
                }
              }}
              style={{ flex: 1, padding: '8px' }}
              error={!!emailError}
            />
            <Button variant="outlined" onClick={addEmail}>
              Add
            </Button>
          </div>
          {emailError && <FormHelperText error>{emailError}</FormHelperText>}

          <EmailList emails={emails} onDelete={removeEmail} />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button 
          variant="contained"
          onClick={handleDelete}
        >Delete</Button>
        <Box>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!row}
          >
            Submit
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
