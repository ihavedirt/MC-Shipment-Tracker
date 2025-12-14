import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
/*import sgMail from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

const SENDER_EMAIL = 'noreply@trackez.com';

async function sendEmail(emailAddress: string, subject: string, body: string): Promise<void> {
    if (!SENDGRID_API_KEY) {
        console.error('[EMAIL FATAL] SENDGRID_API_KEY is not set. Skipping email.');
        return;
    }
    const message = {
        to: emailAddress,
        from: SENDER_EMAIL,
        subject: subject,
        html: `<p>${body.replace(/\n/g, '<br/>')}</p>`,
    };

    try {

    } catch (e: any) {

    }
}
*/
export async function GET(req: NextRequest) {

}
