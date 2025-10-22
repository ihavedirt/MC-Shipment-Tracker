'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { type User } from '@supabase/supabase-js';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  TextField,
  Typography,
  Button,
  Stack,
  Box,
  Divider,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import LinkIcon from '@mui/icons-material/Link';

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error, status } = await supabase
        .from('profiles')
        .select('full_name, username, website, avatar_url')
        .eq('id', user?.id)
        .single();

      if (error && status !== 406) throw error;

      if (data) {
        setFullname(data.full_name);
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch {
      alert('Error loading user data!');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string | null;
    fullname: string | null;
    website: string | null;
    avatar_url: string | null;
  }) {
    try {
      setLoading(true);
      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert('Profile updated!');
    } catch {
      alert('Error updating the data!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card sx={{ maxWidth: 720, mx: 'auto', p: { xs: 1, sm: 2 }, position: 'relative' }}>
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'background.paper',
            opacity: 0.6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            borderRadius: 2,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      <CardHeader title="Profile" subheader="Manage your account and public details" sx={{ pb: 0 }} />

      <CardContent>
        <Stack spacing={3}>
          <Box>
            <Typography variant="overline" color="text.secondary">
              Account
            </Typography>
            <TextField
              label="Email"
              value={user?.email ?? ''}
              disabled
              fullWidth
              sx={{ mt: 1 }}
            />
          </Box>

          <Divider />

          <Box>
            <Typography variant="overline" color="text.secondary">
              Public details
            </Typography>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Full name"
                value={fullname ?? ''}
                onChange={(e) => setFullname(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Username"
                value={username ?? ''}
                onChange={(e) => setUsername(e.target.value)}
                helperText="3+ characters, unique"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Website"
                type="url"
                value={website ?? ''}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.com"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </Box>
        </Stack>
      </CardContent>

      <CardActions sx={{ px: 3, pb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ width: '100%' }}>
          <Button
            variant="contained"
            onClick={() => updateProfile({ fullname, username, website, avatar_url })}
            disabled={loading}
            sx={{ minWidth: 140 }}
          >
            {loading ? 'Saving…' : 'Update'}
          </Button>

          <Box sx={{ flexGrow: 1 }} />

          <form action="/auth/signout" method="post">
            <Button variant="outlined" type="submit">
              Sign out
            </Button>
          </form>
        </Stack>
      </CardActions>
    </Card>
  );
}
