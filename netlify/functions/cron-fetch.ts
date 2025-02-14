import type { Handler } from '@netlify/functions';
import { getYoutubeData, getChannelStats } from '../../src/lib/youtube';

const handler: Handler = async () => {
  try {
    const channels = ['@ShadowMB', '@FactsHive', '@VoiceofMaheedhar'];
    const channelIds = {
      '@ShadowMB': 'UCezP-lhxuxfRrZJlMFX8naQ',
      '@FactsHive': 'UCPEkU0NHJMC2lm77hHncNqw',
      '@VoiceofMaheedhar': 'UCSt52ackN3gdHpNsdhdNfzQ'
    };

    // Fetch both videos and channel stats
    await Promise.all([
      ...channels.map(channel => getYoutubeData(channel)),
      ...Object.values(channelIds).map(id => getChannelStats(id))
    ]);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, timestamp: Date.now() })
    };
  } catch (error) {
    console.error('Scheduled function failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'Failed to fetch data' })
    };
  }
};

export { handler };