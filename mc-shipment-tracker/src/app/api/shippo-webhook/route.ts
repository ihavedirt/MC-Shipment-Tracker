import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Helper to calculate delay status
function calculateDelayStatus(newEtaStr: string | null, savedEtaStr: string | null): string {
    // If we don't have both dates, we can't determine delay
    if (!newEtaStr || !savedEtaStr) return 'NO_INFO';

    const newEta = new Date(newEtaStr).getTime();
    const savedEta = new Date(savedEtaStr).getTime();

    // If the new ETA is later than the one we saved, it's delayed
    if (newEta > savedEta) return 'DELAYED';
    if (newEta < savedEta) return 'AHEAD_OF_SCHEDULE';
    return 'ON_SCHEDULE';
}

function delayHandler(trackingNumber: string) {
    console.log(`[Alert] Shipment ${trackingNumber} is delayed.`);
    // TODO: Send email/SMS notification here
}

export async function POST(req: NextRequest) {
    let event: any;
    try {
        event = await req.json();
    } catch (error) {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    // Filter for Tracker Updates
    // EasyPost events are wrapped in an "Event" object. 
    // We only care about "tracker.updated" or "tracker.created"
    if (event.description !== 'tracker.updated' && event.description !== 'tracker.created') {
        return NextResponse.json({ message: `Ignored event: ${event.description}` }, { status: 200 });
    }

    const tracker = event.result;
    const { 
        id: easypost_id,
        tracking_code,
        carrier, 
        est_delivery_date, 
        status 
    } = tracker;

    if (!easypost_id || !tracking_code) {
        return NextResponse.json({ error: 'Missing tracking data' }, { status: 400 });
    }

    const supabase = await createClient();

    // Fetch Existing Shipment
    const { data: existingShipment, error: fetchError } = await supabase
        .from('shipments')
        .select('eta, delay_status, easypost_id') 
        .eq('easypost_id', easypost_id)
        .single();

    if (fetchError || !existingShipment) {
        // Fallback: Try matching by tracking number + carrier if ID fails
        console.warn("Could not find by EasyPost ID, skipping update.");
        return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }

    // Calculate Delay
    // We compare the incoming "est_delivery_date" against the "eta" currently in the DB.
    // NOTE: This assumes 'eta' in your DB represents the "Original/Previous" ETA.
    const newDelayStatus = calculateDelayStatus(est_delivery_date, existingShipment.eta);

    // Update Database
    const updatePayload = {
        status: status,
        eta: est_delivery_date,
        last_status_update_at: new Date().toISOString(),
        delay_status: newDelayStatus,
    };

    const { error: updateError } = await supabase
        .from('shipments')
        .update(updatePayload)
        .eq('easypost_id', easypost_id);

    if (updateError) {
        console.error('Supabase Update Error:', updateError);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }

    // Trigger Handler if Delayed
    if (newDelayStatus === 'DELAYED') {
        delayHandler(tracking_code);
    }

    return NextResponse.json({ status: 200 });
}

// Generic handler for robustness
export async function GET() {
    return NextResponse.json({ message: 'Shippo webhook endpoint: POST requests only.' }, { status: 405 });
}