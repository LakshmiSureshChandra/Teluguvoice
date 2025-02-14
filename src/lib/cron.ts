import { CronJob } from 'cron';
import { getYoutubeData, getChannelStats } from './youtube';

const channels = ['@ShadowMB', '@FactsHive', '@VoiceofMaheedhar'];
const channelIds = [
  'UCezP-lhxuxfRrZJlMFX8naQ',
  'UCPEkU0NHJMC2lm77hHncNqw',
  'UCSt52ackN3gdHpNsdhdNfzQ'
];

// Run every 5 minutes
const job = new CronJob('*/5 * * * *', async function() {
  try {
    // Update channel stats
    for (const channelId of channelIds) {
      await getChannelStats(channelId);
    }
    
    // Update video data
    for (const channel of channels) {
      await getYoutubeData(channel);
    }
  } catch (error) {
    console.error('Cache update error:', error);
  }
});

export function startCronJob() {
  job.start();
}