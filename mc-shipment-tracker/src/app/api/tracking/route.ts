import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '../../../../utils/supabase/client';

// Create a new tracking
export async function POST(req: NextRequest) {
    // clientside payload
    const body = await req.json();
    const trackingNumber = body.trackingNumber;
    const courierCode = body.carrier;
    const emails = body.emails;
    const reference = body.reference;

    const base = process.env.TRACKINGMORE_BASE_URL + '/trackings/create';
    const apiKey = process.env.TRACKINGMORE_API_KEY;

    if (!base && !apiKey) {
        return NextResponse.json({ error: 'POST() Missing TrackingMore configuration(URL & KEY)' }, { status: 500 });
    }
    if (!base) {
        return NextResponse.json({ error: 'POST() Missing TrackingMore configuration(URL)' }, { status: 500 });
    }
    if (!apiKey) {
        return NextResponse.json({ error: 'POST() Missing TrackingMore configuration(KEY)' }, { status: 500 });
    }

    const url = new URL(base);

    // fetch to aftership
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Tracking-Api-Key': apiKey,
        },
        body: JSON.stringify({
            tracking_number: trackingNumber,
            courier_code: courierCode,
        }),
    });

    // receive as text
    const text = await res.text();

    // parse to json
    const data = JSON.parse(text);

    const { error } = await supabase.from('trackings').insert({
        tracking_number: trackingNumber,
        courier_code: courierCode,
        reference: reference,
        emails: emails,
        
    }).single();

    if (error) {
        console.error('Supabase insert error:', error);
    }

    return NextResponse.json(data, { status: 200 });
}

// Get all trackings
export async function GET() {
    const base = process.env.TRACKINGMORE_BASE_URL + '/trackings/get';
    const apiKey = process.env.TRACKINGMORE_API_KEY;

    if (!base && !apiKey) {
        return NextResponse.json({ error: 'GET() Missing TrackingMore configuration(URL & KEY)' }, { status: 500 });
    }
    if (!base) {
        return NextResponse.json({ error: 'GET() Missing TrackingMore configuration(URL)' }, { status: 500 });
    }
    if (!apiKey) {
        return NextResponse.json({ error: 'GET() Missing TrackingMore configuration(KEY)' }, { status: 500 });
    }

    const url = new URL(base);

    // fetch to aftership
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Tracking-Api-Key': apiKey,
        },
    });

    // receive as text
    const text = await res.text();
    
    // parse to json
    const data = JSON.parse(text);

    return NextResponse.json(data, { status: 200 });
}