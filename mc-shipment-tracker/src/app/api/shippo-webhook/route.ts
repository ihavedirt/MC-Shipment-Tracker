import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SHIPPO_WEBHOOK_SECRET = process.env.SHIPPO_WEBHOOK_SECRET!;

function verifyShippoSignature(rawBody: string, signatureHeader: string | null) {
    if (!signatureHeader || !SHIPPO_WEBHOOK_SECRET) return false;

    const expected = crypto
        .createHmac("sha256", SHIPPO_WEBHOOK_SECRET)
        .update(rawBody, "utf8")
        .digest("hex");

    try {
        return crypto.timingSafeEqual(
        Buffer.from(expected),
        Buffer.from(signatureHeader)
        );
    } catch {
        return false;
    }
}

export async function POST(req: NextRequest) {
    const rawBody = await req.text();                         // need to parse as text for HMAC
    const sigHeader = req.headers.get("shippo-signature");    // check exact header name

    // verify HMAC
    // const valid = verifyShippoSignature(rawBody, sigHeader);
    // if (!valid) {
    //     console.error("Invalid Shippo signature");
    //     return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    // }

    // safe to parse JSON now
    const payload = JSON.parse(rawBody);
    console.log(payload);

    return NextResponse.json({ status: 200 });
    /*
    const trackingNumber = payload.data?.tracking_number;
    const carrierCode = payload.data?.carrier;
    const rawEta = payload.data?.eta;
    const newStatus = payload.data?.tracking_status?.status;
    const statusDate = payload.data?.tracking_status?.status_date;

    const newEta = rawEta ? rawEta.split("T")[0] : null;

    // find shipment
    const { data: shipments } = await supabase
        .from("shipments")
        .select("*")
        .eq("tracking_number", trackingNumber)
        .eq("courier_code", carrierCode)
        .limit(1);

    if (!shipments?.length) {
        return NextResponse.json({ message: "No matching shipment" });
    }

    const shipment = shipments[0];
    const oldEta = shipment.eta; 

    // detect delay
    let isDelayed = false;
    if (oldEta && newEta && newEta > oldEta) {
        isDelayed = true;
    }

    const update: any = {
        previous_eta: shipment.eta,
        eta: newEta,
        status: newStatus ?? shipment.status,
        last_status_update_at: statusDate ? statusDate.split("T")[0] : null,
        delay_status: isDelayed ? "DELAYED" : "ON_TIME",
    };

    // send email once per delay (only when state flips to DELAYED)
    if (isDelayed && shipment.delay_status !== "DELAYED") {
        await sendDelayEmail(shipment);
    }

    await supabase.from("shipments").update(update).eq("id", shipment.id);

    return NextResponse.json({ ok: true });*/


}
/*
async function sendDelayEmail(shipment: any) {
    
    console.log("Delay detected — send email to:", shipment.emails);

}*/
