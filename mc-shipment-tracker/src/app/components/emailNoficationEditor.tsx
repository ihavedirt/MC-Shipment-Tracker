'use client';

import { useState } from 'react';
import {
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

type Frequency = 'none' | 'onDelay' | 'daily' | 'weekly' | 'biweekly' | 'monthly';

export default function EmailNoficationEditor() {
const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('weekly');

  return (
    <Card sx={{ width: '100%' }}>
      <CardHeader 
        title="Notification Settings" 
        subheader="Set primary email and frequency to send reports"
      />
      <CardContent>
        <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
                Currently set email:{' '}
                <strong>{email || 'not set'}</strong>
            </Typography>

            <TextField
                label="Notification email"
                type="email"
                size="small"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <FormControl fullWidth size="small">
                    <InputLabel id="frequency-label">Frequency</InputLabel>
                    <Select
                        labelId="frequency-label"
                        label="Frequency"
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value as Frequency)}
                    >
                        <MenuItem value="none">None</MenuItem>
                        <MenuItem value="onDelay">On Delays</MenuItem>
                        <MenuItem value="daily">Daily</MenuItem>
                        <MenuItem value="weekly">Weekly</MenuItem>
                        <MenuItem value="biweekly">Bi-weekly</MenuItem>
                        <MenuItem value="monthly">Monthly</MenuItem>
                    </Select>
            </FormControl>

            <Typography variant="caption" color="text.secondary">
                You’ll receive shipment updates at email@email.com on x days.
                {/* not exactly sure what the best way to show this is*/}
            </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}