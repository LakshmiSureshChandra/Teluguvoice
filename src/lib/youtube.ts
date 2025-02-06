import { google } from 'googleapis';

export async function getYoutubeData(channelHandle: string) {
  if (!process.env.YOUTUBE_API_KEY) {
    console.error('No API key found');
    return {
      allVideos: [],
      error: 'YouTube API key is not configured'
    };
  }

  const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY
  });

  // Map channel handles to their IDs
  const channelMap: { [key: string]: string } = {
    '@ShadowMB': 'UCezP-lhxuxfRrZJlMFX8naQ',
    '@FactsHive': 'UCPEkU0NHJMC2lm77hHncNqw',
    '@VoiceofMaheedhar': 'UCSt52ackN3gdHpNsdhdNfzQ'
  };

  try {
    const channelId = channelMap[channelHandle];
    console.log('Using channel ID:', channelId);
    
    if (!channelId) {
      throw new Error('Invalid channel handle');
    }

    // Update revalidation to 1 hour
    const response = await fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=contentDetails%2Csnippet&id=${channelId}&key=${process.env.YOUTUBE_API_KEY}`, {
      next: {
        revalidate: 3600 // 1 hour
      }
    });

    // Add hourly revalidation to playlist items fetch
    const channelDetailsResponse = await youtube.channels.list({
      part: ['contentDetails', 'snippet'],
      id: [channelId]
    });

    if (!channelDetailsResponse.data.items?.length) {
      throw new Error('Channel not found');
    }

    const uploadsPlaylistId = channelDetailsResponse.data.items[0].contentDetails?.relatedPlaylists?.uploads;
    console.log('Uploads playlist:', uploadsPlaylistId);

    if (!uploadsPlaylistId) {
      throw new Error('No uploads playlist found');
    }

    // Get playlist items with pagination
    let allVideos = [];
    let nextPageToken = undefined;

    do {
      const playlistItems = await youtube.playlistItems.list({
        part: ['snippet', 'contentDetails', 'status'],
        playlistId: uploadsPlaylistId,
        maxResults: 50,
        pageToken: nextPageToken
      }, {
        next: {
          revalidate: 3600 // 1 hour
        }
      });

      if (playlistItems.data.items?.length) {
        // Inside the video mapping
        const videos = playlistItems.data.items.map(item => {
          // Extract date for grouping
          const publishDate = new Date(item.snippet?.publishedAt || '');
          const month = publishDate.toLocaleString('default', { month: 'long' });
          const year = publishDate.getFullYear();
          
          // Determine if video is a short based on title
          const isShort = item.snippet?.title?.toLowerCase().includes('#shorts') ||
                         item.snippet?.title?.toLowerCase().includes('short');
          
          return {
            id: item.contentDetails?.videoId || '',
            title: item.snippet?.title || '',
            description: item.snippet?.description || '',
            thumbnail: item.snippet?.thumbnails?.maxres?.url || 
                      item.snippet?.thumbnails?.high?.url || 
                      item.snippet?.thumbnails?.medium?.url || '',
            publishedAt: item.snippet?.publishedAt || '',
            month,
            year,
            isShort,
            url: `https://youtube.com/watch?v=${item.contentDetails?.videoId}`
          };
        });
        allVideos = [...allVideos, ...videos];
      }

      nextPageToken = playlistItems.data.nextPageToken;
    } while (nextPageToken);

    // Sort videos by date (newest first)
    allVideos.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    // Group videos by categories first
    const videosByCategory = allVideos.reduce((acc, video) => {
      if (!acc[video.category]) {
        acc[video.category] = [];
      }
      acc[video.category].push(video);
      return acc;
    }, {});

    // Then group by year and month within categories
    const groupedVideos = Object.keys(videosByCategory).reduce((acc, category) => {
      acc[category] = videosByCategory[category].reduce((yearAcc, video) => {
        const yearKey = video.year.toString();
        const monthKey = `${video.month} ${video.year}`;
        
        if (!yearAcc[yearKey]) {
          yearAcc[yearKey] = {
            year: video.year,
            months: {}
          };
        }
        
        if (!yearAcc[yearKey].months[monthKey]) {
          yearAcc[yearKey].months[monthKey] = {
            videos: []
          };
        }
        
        yearAcc[yearKey].months[monthKey].videos.push(video);
        return yearAcc;
      }, {});
      return acc;
    }, {});

    // Get total counts
    const totalVideos = allVideos.length;
    const videosPerPage = 12;
    const totalPages = Math.ceil(totalVideos / videosPerPage);

    console.log('Found total videos:', totalVideos);
    return {
      videos: allVideos.slice(0, videosPerPage), // First page of videos
      allVideos, // All videos stored here
      videosByCategory, // Videos grouped by category
      groupedVideos, // Videos grouped by category, year, and month
      pagination: {
        totalVideos,
        videosPerPage,
        totalPages,
        currentPage: 1
      },
      error: null
    };

    // Remove this duplicate return
    // console.log('Found total videos:', allVideos.length);
    // return {
    //   videos: allVideos,
    //   groupedVideos,
    //   communityPosts: [],
    //   error: null
    // };

  } catch (error: any) {
    console.error('YouTube API Error:', error);
    return {
      videos: [],
      communityPosts: [],
      error: error.message || 'Failed to fetch YouTube data'
    };
  }
}