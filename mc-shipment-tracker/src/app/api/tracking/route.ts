import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Create a new tracking
export async function POST(req: NextRequest) {
    // clientside payload
    const body = await req.json();

    const base = process.env.SHIPPO_BASE_URL;
    const apiKey = process.env.SHIPPO_API_KEY; 

    // Env checks
    if (!base || !apiKey) {
      return NextResponse.json({ error: "Missing shipment api configuration."}, { status: 500 });
    }

    // create url
    // const url = new URL('/trackings/create', base);  // trackingmore
    const url = new URL('tracks/', base);

    // check for session from user cookies
    const supabase = await createClient();
    const { data: {user}, error: userErr } = await supabase.auth.getUser();

    if (userErr) {
        return NextResponse.json({ error: "Auth error", details: userErr }, { status: 401 });
    }
    if (!user) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // fetch to aftership
    const trackingRes = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `ShippoToken ${apiKey}`, 
        },
        body: JSON.stringify({
            tracking_number: body.trackingNumber,
            carrier: body.carrier,
        }),
        cache: "no-store",
    });

    console.log(trackingRes);

    // TODO: handle non 2xx respones here

    // parse response
    let trackingData: any = null;
    try {
        trackingData = await trackingRes.json();
    } catch {
        trackingData = null;
    }

    // get delayed and devliered status
    let delayed_status = false;

    let status = trackingData.tracking_status.status;

    const payload = {
        tracking_number: body.trackingNumber,
        courier_code: body.carrier,
        reference: body.reference ?? null,
        emails: body.emails ?? [],
        est_delivery: trackingData?.eta ?? null,
        status: status,
        delayed: delayed_status,
    };

    // insert to db
    const { data: inserted, error: insertError } = await supabase
        .from('shipments')
        .insert(payload)
        .select()
        .single();

    if (insertError) {
        if (insertError.code === "23505") {
            
        }
        return NextResponse.json({ error: 'Insert failed', details: insertError }, { status: 500 });
    }

    return NextResponse.json(trackingData, { status: 200 });
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
        .select('*');

    if (error) {
        return NextResponse.json({ error: 'Database error', details: error }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
}


// might be worth to implement an update function which gets all trackings from trackingmore and then adds to the database the trackings which are not in db yet
export async function UPDATE() {

}

export async function DELETE(req: NextRequest) {
    const supabase = await createClient();
    const { data: {user}, error: userErr } = await supabase.auth.getUser();
    
    const body = await req.json();

    console.log("internal delete called");

    if (userErr) {
        return NextResponse.json({ error: "Auth error", details: userErr }, { status: 401 });
    }
    if (!user) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data, error } = await supabase
        .from('shipments')
        .delete()
        .eq('tracking_number', body.trackingNumber);

    if (error) {
        return NextResponse.json({ error: 'Database error', details: error }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
}

// // old get fro getting trackingmore trackings from their api
// // Get all trackings
// export async function GET() {
//     const base = process.env.TRACKINGMORE_BASE_URL + '/trackings/get';
//     const apiKey = process.env.TRACKINGMORE_API_KEY;

//     if (!base && !apiKey) {
//         return NextResponse.json({ error: 'GET() Missing TrackingMore configuration(URL & KEY)' }, { status: 500 });
//     }
//     if (!base) {
//         return NextResponse.json({ error: 'GET() Missing TrackingMore configuration(URL)' }, { status: 500 });
//     }
//     if (!apiKey) {
//         return NextResponse.json({ error: 'GET() Missing TrackingMore configuration(KEY)' }, { status: 500 });
//     }

//     const url = new URL(base);

//     // fetch to aftership
//     const res = await fetch(url, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'Tracking-Api-Key': apiKey,
//         },
//     });

//     // const res = await supabase.from('shipments').select('*').eq('user_id', session?.user.id);

//     // receive as text
//     const text = await res.text();
    
//     // parse to json
//     const data = JSON.parse(text);

//     return NextResponse.json(data, { status: 200 });
// }