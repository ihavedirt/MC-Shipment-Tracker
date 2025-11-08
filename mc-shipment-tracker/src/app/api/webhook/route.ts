import { NextRequest, NextResponse } from 'next/server'


export async function POST(req: NextRequest) {
    try {
        // recieve update
        // if the updated eta is different from the existing one then mark as delayed
        
    } catch (e) {
        console.error(e);
        return NextResponse.json({error: e}, {status: 400});
    }
}