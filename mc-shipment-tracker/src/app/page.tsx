'use client'

import BasicTable from './_components/table'
import { Button, TextField, Table } from '@mui/material';

export default function Home() {
  return (
    <div>
      <TextField label="Tracking No." variant="standard"/>
      <Button variant='contained'>Submit</Button>
      <BasicTable/>
    </div>
  );
}