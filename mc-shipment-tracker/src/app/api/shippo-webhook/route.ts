import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

function isDelayed(currentEtaStr: string | null, originalEtaStr: string | null): string {
  if (!currentEtaStr || !originalEtaStr) {
    return 'NO_INFO';
  }
  
  const currentEta = new Date(currentEtaStr).getTime();
  const originalEta = new Date(originalEtaStr).getTime();

  if (currentEta > originalEta) {
    return 'DELAYED';
  } else if (currentEta < originalEta) {
    return 'AHEAD_OF_SCHEDULE';
  } else {
    return 'ON_SCHEDULE';
  }
}

function delayHandler() {
    console.log("delayed");
}

export async function POST(req: NextRequest) {

    // should implement a mechanism to verify the Shippo signature

    let payload: any;
    try {
        payload = await req.json();
    } catch (error) {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
    
    const supabase = await createClient();

    if (payload.event !== 'track_updated') {
        // We only care about tracking updates. Ignore other events and return OK.
        return NextResponse.json({ message: `Ignored event type: ${payload.event}` }, { status: 200 });
    }

    const data = payload.data;
    const { 
        tracking_number, 
        carrier, 
        eta: current_eta_raw,
        original_eta: original_eta_raw,
    } = data;
    
    const current_status = data.tracking_status?.status;
    const status_date = data.tracking_status?.status_date;

    if (!tracking_number || !carrier || !current_status) {
        return NextResponse.json({ error: 'Missing essential tracking data in payload.' }, { status: 400 });
    }

    const current_eta = current_eta_raw ? new Date(current_eta_raw).toISOString().split('T')[0] : null;
    const previous_eta = original_eta_raw ? new Date(original_eta_raw).toISOString().split('T')[0] : null;
    const last_status_update_at = status_date ? new Date(status_date).toISOString().split('T')[0] : null;

    const delay_status = isDelayed(current_eta_raw, original_eta_raw);

    const updateData = {
        courier_code: carrier.toLowerCase(),
        tracking_number,
        status: current_status,
        eta: current_eta,
        previous_eta,
        delay_status,
        last_status_update_at,
    };

    const { data: updatedShipment, error } = await supabase
        .from('shipments')
        .update(updateData)
        .eq('tracking_number', tracking_number)
        .eq('courier_code', carrier.toLowerCase())
        .select();

    if (error) {
        console.error('Supabase Update Error:', error);
        return NextResponse.json({ error: 'Database update failed', details: error.message }, { status: 500 });
    }

    if (delay_status === 'DELAYED') {
        delayHandler();
    }

    return NextResponse.json({ status: 200 });
}

// Generic handler for robustness
export async function GET() {
    return NextResponse.json({ message: 'Shippo webhook endpoint: POST requests only.' }, { status: 405 });
}