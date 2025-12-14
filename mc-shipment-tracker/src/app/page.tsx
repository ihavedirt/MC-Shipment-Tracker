/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Container, Grid, Box, Typography, Button, Stack, Card, CardContent } from "@mui/material";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();
      {/* <Button variant="contained" onClick={() => router.push("/login")}>
        Login / Sign Up
      </Button> */}
      
  return (
    <Box>
      
      {/* Header/Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'grey.300',
          minHeight: { xs: 500, md: 600 },
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'flex-end',
          pb: 4
        }}
      >
      </Box>

      <Box 
        sx={{ 
          bgcolor: 'grey.100',
          minHeight: { xs: 100, md: 100 },
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
        }}
      >
        <Typography 
            variant="h3" 
            component="h1"
            align="center"
            sx={{ fontWeight: 600, width: '100%' }}
            color="grey"
          >
            Manage your shipments with ease
        </Typography>
      </Box>

      {/* Feature/Content Blocks (Staggered Layout) */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        
        {/* --- Top Staggered Block: Image Left, Text Right (4/8 split) --- */}
        <Grid container spacing={4} alignItems="center" sx={{ mb: 10 }}>
          
          {/* Left Image Placeholder (4/12 width) */}
          <Grid  size={{xs: 12, md: 4}}>
            <Card sx={{ height: 300, bgcolor: 'grey.500', borderRadius: 1 }} />
          </Grid>
          
          {/* Right Text Block (8/12 width) */}
          <Grid size={{xs: 12, md: 8}}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h5" color="grey" sx={{ mb: 0.5 }}>Track Shipments</Typography>
              <Typography variant="body1" color="text.secondary">Track your shipments with ease. See your shipments and their status.</Typography>
            </Box>
          </Grid>
        </Grid>

        {/* --- Bottom Staggered Block: Text Left, Image Right (8/4 split) --- */}
        <Grid container spacing={4} alignItems="center">
          
          {/* Left Text Block (8/12 width) */}
          <Grid size={{xs: 12, md: 8}} sx={{ order: { xs: 2, md: 1 } }}>
            <Box sx={{ p: 2, textAlign: 'right' }}>
              <Typography variant="h5" color="grey" sx={{ mb: 0.5 }}>Get Notified on Delays</Typography>
              <Typography variant="body1" color="text.secondary">Notify all parties involved when delays occur</Typography>
            </Box>
          </Grid>
          
          {/* Right Image Placeholder (4/12 width) */}
          <Grid size={{xs: 12, md: 4}} sx={{ order: { xs: 1, md: 2 } }}>
            <Card sx={{ height: 300, bgcolor: 'grey.500', borderRadius: 1 }} />
          </Grid>
        </Grid>
      </Container>

      {/* Mid-Page Separator/CTA Block */}
      <Box 
        sx={{ 
          bgcolor: 'grey.600', 
          height: { xs: 300, md: 400 }, 
          width: '100%', 
          my: 8 
        }} 
      />

      {/* Footer/Summary Section (4 small items: 2 columns, 2 rows each) */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          
          {/* Left Half (Contains two items stacked) */}
          <Grid size={{xs: 12, md: 6}}>
            <Grid container spacing={3}>
              <Grid size={{xs: 12}}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                  <Card sx={{ height: 60, width: 60, bgcolor: 'grey.400', flexShrink: 0, mr: 2 }} />
                  <Typography variant="body2" color="grey">small text here</Typography>
                </Box>
              </Grid>
              <Grid size={{xs: 12}}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                  <Card sx={{ height: 60, width: 60, bgcolor: 'grey.400', flexShrink: 0, mr: 2 }} />
                  <Typography variant="body2" color="grey">small text here</Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* Right Half (Contains two items stacked) */}
          <Grid size={{xs: 12, md: 6}}>
            <Grid container spacing={3}>
              <Grid size={{xs: 12}}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                  <Card sx={{ height: 60, width: 60, bgcolor: 'grey.400', flexShrink: 0, mr: 2 }} />
                  <Typography variant="body2" color="grey">small text here</Typography>
                </Box>
              </Grid>
              <Grid size={{xs: 12}}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                  <Card sx={{ height: 60, width: 60, bgcolor: 'grey.400', flexShrink: 0, mr: 2 }} />
                  <Typography variant="body2" color="grey">small text here</Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          
        </Grid>
      </Container>
      
    </Box>
  );
}