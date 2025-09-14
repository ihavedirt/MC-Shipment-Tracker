import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    // clientside payload
    const body = await req.json();
    const trackingNumber = body.trackingNumber;

    const base = process.env.AFTERSHIP_BASE_URL + '/tracking';
    const apiKey = process.env.AFTERSHIP_API_KEY;

    if (!base || !apiKey) {
        return NextResponse.json({ error: 'Missing Aftership configuration' }, { status: 500 });
    }

    const url = new URL(base);

    // fetch to aftership
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'app-name': 'mc-shipment-tracker',
            'Content-Type': 'application/json',
            'trackship-api-key': apiKey,
        },
        body: JSON.stringify({
            tracking_number: trackingNumber,
            tracking_provider: 'ups',
        }),
    });

    const data = await res.json();
    return NextResponse.json(data);
}