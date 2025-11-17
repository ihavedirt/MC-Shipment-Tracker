import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto';

type ShipmentRow = {
    id: string;
    user_id: string;
    // tracking_number
    // reference
    // eta
    // delay_status
    // status
    // emails
    // previous_eta
    // delay_reason
    // last_status_update_at
}

type ShippoPayload = {
    event: string;
}

const SHIPPO_WEBHOOK_SECRET = process.env.SHIPPO_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const signature = req.headers.get('shippo-signature');
        
        const valid = verifyShippoSignature(body, signature);

        if (!valid) {
            console.error('Invalid Shippo signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const payload = JSON.parse(body);

        await handleShippoEvent(payload);

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({error: e}, {status: 400});
    }
}

function verifyShippoSignature(body: string, signatureHeader: string | null) {
    if (!signatureHeader) return false;
    if (!SHIPPO_WEBHOOK_SECRET) return false;

    const expected = crypto
        .createHmac('sha256', SHIPPO_WEBHOOK_SECRET)
        .update(body, 'utf8')
        .digest('hex');

    return crypto.timingSafeEqual(
        Buffer.from(expected),
        Buffer.from(signatureHeader)
    );
}

function detectDelay(oldEta: Date | null, newEta: Date | null) {
    if (!oldEta && newEta) {
        return { delayed: false, status: 'ON_TIME' as const };
    }
    if (oldEta && !newEta) {
        return { delayed: false, status: 'UNKNOWN' as const };
    }
    if (!oldEta && !newEta) {
        return { delayed: false, status: 'UNKNOWN' as const };
    }

    // both exist
    const diffMs = newEta!.getTime() - oldEta!.getTime();
    const diffHours = diffMs / 3_600_000;
    const delayThresholdHours = 0; // set this to change threshold

    if (diffHours > delayThresholdHours) {
        return { delayed: true, status: 'DELAYED' as const };
    }

    return { delayed: false, status: 'ON_TIME' as const };
}

async function handleShippoEvent(payload: ShippoPayload) {

}