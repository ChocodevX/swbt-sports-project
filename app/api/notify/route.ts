import { type NextRequest, NextResponse } from 'next/server';
import { notifyDiscord } from '@/lib/discord';

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  await notifyDiscord(String(message));
  return NextResponse.json({ ok: true });
}
