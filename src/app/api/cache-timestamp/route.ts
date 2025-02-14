import { getCacheTimestamp } from '@/lib/youtube';

export async function GET() {
  const timestamp = getCacheTimestamp('data_@VoiceofMaheedhar');
  return Response.json({ timestamp });
}