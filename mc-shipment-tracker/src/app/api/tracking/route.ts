import { NextResponse, NextRequest } from 'next/server';

// Create a new tracking
export async function POST(req: NextRequest) {
    // clientside payload
    const body = await req.json();
    const trackingNumber = body.trackingNumber;

    const base = process.env.TRACKINGMORE_BASE_URL + '/trackings/create';
    const apiKey = process.env.TRACKINGMORE_API_KEY;

    if (!base || !apiKey) {
        return NextResponse.json({ error: 'Missing TrackingMore configuration' }, { status: 500 });
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
            courier_code: 'ups',
        }),
    });

    // receive as text
    const text = await res.text();

    // parse to json
    const data = JSON.parse(text);

    return NextResponse.json(data, { status: 200 });
}

// Get all trackings
export async function GET() {
    const base = process.env.TRACKINGMORE_BASE_URL + '/trackings/get';
    const apiKey = process.env.TRACKINGMORE_API_KEY;

    if (!base || !apiKey) {
        return NextResponse.json({ error: 'Missing TrackingMore configuration' }, { status: 500 });
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