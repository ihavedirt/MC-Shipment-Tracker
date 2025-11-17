'use client';

import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

export type Props = {
  open: boolean;
  onClose: () => void;
  selectedRows?: readonly string[] | null;
  onSuccess: () => void;
};

export default function BulkDeleteConfirmation({ open, onClose, selectedRows, onSuccess }: Props) {

    const handleConfirm = async () => {
        if (!selectedRows) return;

        try {
        const res = await fetch('/api/tracking', {
            method: 'DELETE',
            headers: { 
            'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ 
            trackingNumber: selectedRows
            }),
        });

        const json = await res.json();

        if (!res.ok) {
            console.error('Bulk delete failed', json);
            return;
        }

        } catch (e) {
            console.error(e);
        }

        onSuccess();
        onClose();
    };


  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Bulk Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {selectedRows && selectedRows.length > 0
            ? `Are you sure you want to delete ${selectedRows.length} selected item${
                selectedRows.length > 1 ? 's' : ''
              }? This action cannot be undone.`
            : 'No items selected.'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
