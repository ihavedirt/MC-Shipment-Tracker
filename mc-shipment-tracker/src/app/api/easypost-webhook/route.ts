import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import EasyPostClient from "@easypost/api";

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
    const apiKey = process.env.EASYPOST_API_KEY!;
    const webhookSecret = process.env.EASYPOST_WEBHOOK_SECRET!;
    const client = new EasyPostClient(apiKey);

    const rawBody = await req.text();
    const headers = Object.fromEntries(req.headers.entries());

    try {
        // This helper validates that the request is authentic
        client.Utils.validateWebhook(Buffer.from(rawBody), headers, webhookSecret);
    } catch (error) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    // We only care about "tracker.updated" or "tracker.created"
    if (event.description !== 'tracker.updated' && event.description !== 'tracker.created') {
        return NextResponse.json({ message: `Ignored event: ${event.description}` }, { status: 200 });
    }

    const tracker = event.result;
    const { 
        id: easypost_id,
        tracking_code,
        est_delivery_date, 
        status 
    } = tracker;

    const supabase = await createClient();

    // Fetch Existing Shipment
    const { data: existingShipment, error: fetchError } = await supabase
        .from('shipments')
        .select('eta, easypost_id') 
        .eq('easypost_id', easypost_id)
        .single();

    if (fetchError || !existingShipment) {
        console.warn("Could not find by EasyPost ID, skipping update.");
        return NextResponse.json({ error: 'Shipment not found' }, { status: 200 });
    }

    const hasEtaChanged = existingShipment.eta !== est_delivery_date;
    const previousEta = hasEtaChanged ? existingShipment.eta : null;

    // Calculate Delay
    const newDelayStatus = calculateDelayStatus(est_delivery_date, existingShipment.eta);

    // Update Database
    const { error: updateError } = await supabase
        .from('shipments')
        .update({
            status: status,
            eta: est_delivery_date,
            previous_eta: previousEta,
            last_status_update_at: new Date().toISOString(),
            delay_status: newDelayStatus,
        })
        .eq('easypost_id', easypost_id);

    if (updateError) {
        console.error('Supabase Update Error:', updateError);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }

    // Trigger Handler if Delayed
    if (newDelayStatus === 'DELAYED') {
        delayHandler(tracking_code);
    }

    return NextResponse.json({ success: true }, { status: 200 });
}

// Generic handler for robustness
export async function GET() {
    return NextResponse.json({ message: 'Shippo webhook endpoint: POST requests only.' }, { status: 405 });
}