import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import EasyPostClient from '@easypost/api';

// Create a new tracking
export async function POST(req: NextRequest) {
    // clientside payload
    const body = await req.json();
    const apiKey = process.env.EASYPOST_API_KEY; 

    // Env checks
    if (!apiKey) {
      return NextResponse.json({ error: "Missing shipment api configuration."}, { status: 500 });
    }

    const client = new EasyPostClient(apiKey);

    // check for session from user cookies
    const supabase = await createClient();
    const { data: {user}, error: userErr } = await supabase.auth.getUser();

    if (userErr) {
        return NextResponse.json({ error: "Auth error", details: userErr }, { status: 401 });
    }
    if (!user) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
        // Create tracker using the client
        const trackingData = await client.Tracker.create({
            tracking_code: body.trackingNumber,
            carrier: body.carrier,
        });

        // Prepare database payload
        const payload = {
            tracking_number: body.trackingNumber,
            courier_code: body.carrier,
            reference: body.reference ?? null,
            emails: body.emails ?? [],
            eta: trackingData.est_delivery_date ?? null,
            status: trackingData.status ?? "unknown",
            user_id: user.id,
            easypost_id: trackingData.id
        };

        // Insert to Supabase
        const { data: inserted, error: insertError } = await supabase
            .from('shipments')
            .insert(payload)
            .select()
            .single();

        if (insertError) {
            if (insertError.code === "23505") {
                return NextResponse.json({ error: 'Tracking number already exists' }, { status: 409 });
            }
            return NextResponse.json({ error: 'Insert failed', details: insertError }, { status: 500 });
        }

        return NextResponse.json(trackingData, { status: 200 });

    } catch (error){
        console.error("EasyPost SDK Error:", error);
        return NextResponse.json({ error: "EasyPost Error", details: error || "Failed to create tracker" }, { status: 500 });
    }
}


// gets all trackings from database
export async function GET() {
    // check for session from user cookies
    const supabase = await createClient();
    const { data: {user}, error: userErr } = await supabase.auth.getUser();
    
    if (userErr) {
        return NextResponse.json({ error: "Auth error", details: userErr }, { status: 401 });
    }
    if (!user) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('user_id', user.id);

    if (error) {
        return NextResponse.json({ error: 'Database error', details: error }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
}


// export async function UPDATE() {

// }

// deletes given tracking numbers
export async function DELETE(req: NextRequest) {
    // check for session from user cookies
    const supabase = await createClient();
    const { data: { user }, error: userErr } = await supabase.auth.getUser();

    if (userErr) {
        return NextResponse.json({ error: "Auth error", details: userErr }, { status: 401 });
    }
    if (!user) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));

    // Normalize trackingNumber(s) and validate input
    const tnRaw = body?.trackingNumber;
    const arr = Array.isArray(tnRaw) ? tnRaw : [tnRaw];
    const trackingNumbers = arr
        .map((v: unknown) => String(v ?? '').trim())
        .filter((s: string) => s.length > 0);

    if (!trackingNumbers.length) {
        return NextResponse.json({ error: 'Missing trackingNumber(s)' }, { status: 400 });
    }

    // Delete only rows owned by the current user
    const { data, error } = await supabase
        .from('shipments')
        .delete()
        .in('tracking_number', trackingNumbers)
        .eq('user_id', user.id)
        .select(); // return deleted rows to count

    if (error) {
        return NextResponse.json({ error: 'Database error', details: error }, { status: 500 });
    }

    if (!data || data.length === 0) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, deleted: data.length }, { status: 200 });
}
