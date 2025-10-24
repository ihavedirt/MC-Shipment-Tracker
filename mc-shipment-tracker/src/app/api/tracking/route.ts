import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Create a new tracking
export async function POST(req: NextRequest) {
    // clientside payload
    const body = await req.json();

    const base = process.env.TRACKINGMORE_BASE_URL;
    const apiKey = process.env.TRACKINGMORE_API_KEY; 

    // Env checks
    if (!base || !apiKey) {
      return NextResponse.json({ error: "Missing TrackingMore configuration."}, { status: 500 });
    }

    // create url
    const url = new URL('/trackings/create', base);

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
            'Tracking-Api-Key': apiKey,
        },
        body: JSON.stringify({
            tracking_number: body.trackingNumber,
            courier_code: body.carrier,
        }),
    });

    // TODO: handle non 2xx respones here

    // parse response
    let trackingData: any = null;
    try {
        trackingData = await trackingRes.json();
    } catch {
        trackingData = null;
    }

    console.log(trackingRes);

    // get delayed and devliered status
    let delayed_status = false;
    if (trackingData.data.delayed === true) { // this needs to be fixed, using today > est_delivery wont work cuz thatll be too late. maybe check for status updateds that warrant delays
        delayed_status = true;
    }

    let delivered_status = false;
    if (trackingData.data.delivery_status === 'Delivered' || trackingData.data.sub_status === 'delivered001' || trackingData.data.latest_event === 'DELIVERED') {
        delivered_status = true;
    }

    const payload = {
        tracking_number: body.trackingNumber,
        courier_code: body.carrier,
        reference: body.reference ?? null,
        emails: body.emails ?? [],
        est_delivery: trackingData?.est_delivery ?? null,
        delayed: delayed_status,
        delivered: delivered_status,
    };

    // insert to db
    const { data: inserted, error: insertError } = await supabase
        .from('shipments')
        .insert(payload)
        .select()
        .single();

    if (insertError) {
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