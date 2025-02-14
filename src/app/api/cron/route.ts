import { NextResponse } from 'next/server';
import { getYoutubeData } from '@/lib/youtube';

export async function GET() {
  try {
    // Fetch data for all channels
    const channels = ['@ShadowMB', '@FactsHive', '@VoiceofMaheedhar'];
    const results = await Promise.all(
      channels.map(channel => getYoutubeData(channel))
    );
    
    return NextResponse.json({ success: true, timestamp: Date.now() });
  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch data' }, { status: 500 });
  }
}