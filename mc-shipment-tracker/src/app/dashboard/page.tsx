/* eslint-disable @typescript-eslint/no-explicit-any */

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import DashboardForm from './dashboard-form';

export default async function Dashboard() {

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <DashboardForm />
  );
}