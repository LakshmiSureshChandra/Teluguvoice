import { google, youtube_v3 } from "googleapis"; // Import youtube_v3 to use the type for the response


    // Type Definitions
    // Move VideoData type to the top level
    // Add export to the VideoData type at the top level
    export type VideoData = {
      id: string;
      title: string;
      description: string;
      thumbnail: string;
      publishedAt: string;
      month: string;
      year: number;
      isShort: boolean;
      url: string;
      duration: string;
      viewCount: string;
      likeCount: string;
    };
// Add this type at the top with other type definitions
// Separate types for different cache data types
type YoutubeDataResponse = {
  videos: unknown[];
  allVideos: unknown[];
  videosByCategory: Record<string, unknown[]>;
  groupedVideos: Record<string, unknown>;
  pagination?: {
    totalVideos: number;
    videosPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  error?: string | null;
};

type ChannelStats = {
  subscriberCount: string;
  videoCount: string;
  viewCount: string;
};

type CacheData<T> = {
  timestamp: number;
  data: T;
};

// Separate caches for different types of data
const statsCache: { [key: string]: CacheData<ChannelStats> } = {};
const dataCache: { [key: string]: CacheData<YoutubeDataResponse> } = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Update cache functions to be type-safe
function isCacheValid(key: string, isStats: boolean = false): boolean {
  const cacheEntry = isStats ? statsCache[key] : dataCache[key];
  if (!cacheEntry) {
    console.log(`Cache miss for ${key}`);
    return false;
  }
  const isValid = Date.now() - cacheEntry.timestamp < CACHE_DURATION;
  console.log(`Cache ${isValid ? 'hit' : 'expired'} for ${key}`);
  return isValid;
}

// Update the setCacheData function with constrained generic type
// Update setCacheData to handle different cache types correctly
function setCacheData(
  key: string,
  data: YoutubeDataResponse | ChannelStats,
  isStats: boolean = false
): void {
  if (isStats) {
    statsCache[key] = {
      timestamp: Date.now(),
      data: data as ChannelStats,
    };
  } else {
    dataCache[key] = {
      timestamp: Date.now(),
      data: data as YoutubeDataResponse,
    };
  }
  console.log(`Cache updated for ${key}`);
}

// Update getCachedData to be type-safe
function getCachedData<T extends YoutubeDataResponse | ChannelStats>(
  key: string,
  isStats: boolean = false
): T | undefined {
  const cache = isStats ? statsCache[key] : dataCache[key];
  return cache?.data as T;
}

export function getCacheTimestamp(key: string, isStats: boolean = false): number {
  const cache = isStats ? statsCache : dataCache;
  return cache[key]?.timestamp || Date.now();
}

export async function getChannelStats(channelId: string): Promise<ChannelStats> {
  const cacheKey = `stats_${channelId}`;
  if (isCacheValid(cacheKey, true)) {
    return getCachedData<ChannelStats>(cacheKey, true)!;
  }

  const youtube = google.youtube({
    version: "v3",
    auth: process.env.YOUTUBE_API_KEY,
  });

  try {
    const response = await youtube.channels.list({
      part: ["statistics"],
      id: [channelId],
    });

    const stats = response.data.items?.[0]?.statistics;
    const result = {  // Store in variable first
      subscriberCount: stats?.subscriberCount || "0",
      videoCount: stats?.videoCount || "0",
      viewCount: stats?.viewCount || "0",
    };
    
    // Cache before return
    setCacheData(cacheKey, result, true);
    return result;
  } catch (error) {
    console.error("Error fetching channel stats:", error);
    const fallbackResult = {
      subscriberCount: "0",
      videoCount: "0",
      viewCount: "0",
    };
    setCacheData(cacheKey, fallbackResult, true);
    return fallbackResult;
  }
}

// Update the function signature to specify return type
export async function getYoutubeData(channelHandle: string): Promise<YoutubeDataResponse> {
  const cacheKey = `data_${channelHandle}`;
  if (isCacheValid(cacheKey)) {
    return getCachedData<YoutubeDataResponse>(cacheKey) || {
      videos: [],
      allVideos: [],
      videosByCategory: {},
      groupedVideos: {},
      error: "Cache miss",
    };
  }

  if (!process.env.YOUTUBE_API_KEY) {
    console.error("No API key found");
    return {
      videos: [],
      allVideos: [],
      videosByCategory: {},
      groupedVideos: {},
      error: "YouTube API key is not configured",
    };
  }

  const youtube = google.youtube({
    version: "v3",
    auth: process.env.YOUTUBE_API_KEY,
  });

  // Map channel handles to their IDs
  const channelMap: { [key: string]: string } = {
    "@ShadowMB": "UCezP-lhxuxfRrZJlMFX8naQ",
    "@FactsHive": "UCPEkU0NHJMC2lm77hHncNqw",
    "@VoiceofMaheedhar": "UCSt52ackN3gdHpNsdhdNfzQ",
  };

  try {
    const channelId = channelMap[channelHandle];
    console.log("Using channel ID:", channelId);

    if (!channelId) {
      throw new Error("Invalid channel handle");
    }

    // Fetch channel details
    const channelDetailsResponse = await youtube.channels.list({
      part: ["contentDetails", "snippet"],
      id: [channelId],
    });

    if (!channelDetailsResponse.data.items?.length) {
      throw new Error("Channel not found");
    }

    const uploadsPlaylistId =
      channelDetailsResponse.data.items[0].contentDetails?.relatedPlaylists
        ?.uploads;
    console.log("Uploads playlist:", uploadsPlaylistId);

    if (!uploadsPlaylistId) {
      throw new Error("No uploads playlist found");
    }

    // Remove the type definitions here and just use the ones from the top level
    let allVideos: VideoData[] = [];
    let nextPageToken: string | null | undefined = undefined;

    do {
      // Update playlist items request to include contentDetails
      const playlistItemsResponse: youtube_v3.Schema$PlaylistItemListResponse = (
        await youtube.playlistItems.list({
          part: ["snippet", "contentDetails", "status"],
          playlistId: uploadsPlaylistId,
          maxResults: 50,
          pageToken: nextPageToken,
        })
      ).data;

      if (playlistItemsResponse.items?.length) {
        // Fetch video details for each batch of videos
        const videoIds = playlistItemsResponse.items.map(
          (item) => item.contentDetails?.videoId || ""
        ).filter(Boolean);

        const videoDetailsResponse = await youtube.videos.list({
          part: ["contentDetails", "statistics"],
          id: videoIds,
        });

        const videoDetailsMap = new Map(
          videoDetailsResponse.data.items?.map((item) => [
            item.id,
            {
              duration: item.contentDetails?.duration || "",
              viewCount: item.statistics?.viewCount || "0",
              likeCount: item.statistics?.likeCount || "0",
            },
          ])
        );

        const videos = playlistItemsResponse.items.map(
          (item: youtube_v3.Schema$PlaylistItem) => {
            const publishDate = new Date(item.snippet?.publishedAt || 0);
            const month = publishDate.toLocaleString("default", {
              month: "long",
            });
            const year = publishDate.getFullYear();
            const videoId = item.contentDetails?.videoId || "";
            const videoDetails = videoDetailsMap.get(videoId);

            const isShort =
              item.snippet?.title?.toLowerCase().includes("#shorts") ||
              item.snippet?.title?.toLowerCase().includes("short");

            return {
              id: videoId,
              title: item.snippet?.title || "",
              description: item.snippet?.description || "",
              thumbnail:
                item.snippet?.thumbnails?.maxres?.url ||
                item.snippet?.thumbnails?.high?.url ||
                item.snippet?.thumbnails?.medium?.url ||
                "",
              publishedAt: item.snippet?.publishedAt || "",
              month,
              year,
              isShort: !!isShort,
              url: `https://youtube.com/watch?v=${videoId}`,
              duration: videoDetails?.duration || "",
              viewCount: videoDetails?.viewCount || "0",
              likeCount: videoDetails?.likeCount || "0",
            };
          }
        );

        allVideos = allVideos.concat(videos);
      }

      nextPageToken = playlistItemsResponse.nextPageToken;
    } while (nextPageToken);

    // Sort videos by date (newest first)
    allVideos.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    // Group videos by categories first (if applicable)
    const videosByCategory: { [key: string]: VideoData[] } = allVideos.reduce(
      (acc, video) => {
        const category = video.isShort ? "Shorts" : "Regular Videos";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(video);
        return acc;
      },
      {} as { [key: string]: VideoData[] }
    );

    // Then group by year and month within categories
    const groupedVideos = Object.keys(videosByCategory).reduce(
      (acc, category) => {
        acc[category] = videosByCategory[category].reduce((yearAcc, video) => {
          const yearKey = video.year.toString();
          const monthKey = `${video.month} ${video.year}`;

          if (!yearAcc[yearKey]) {
            yearAcc[yearKey] = {
              year: video.year,
              months: {},
            };
          }

          if (!yearAcc[yearKey].months[monthKey]) {
            yearAcc[yearKey].months[monthKey] = {
              videos: [],
            };
          }

          yearAcc[yearKey].months[monthKey].videos.push(video);
          return yearAcc;
        }, {} as Record<string, { year: number; months: Record<string, { videos: VideoData[] }> }>);
        return acc;
      },
      {} as Record<
        string,
        Record<
          string,
          { year: number; months: Record<string, { videos: VideoData[] }> }
        >
      >
    );

    // Get total counts
    const totalVideos = allVideos.length;
    const videosPerPage = 12;
    const totalPages = Math.ceil(totalVideos / videosPerPage);

    console.log("Found total videos:", totalVideos);
    const result = {
      videos: allVideos.slice(0, videosPerPage),
      allVideos,
      videosByCategory,
      groupedVideos,
      pagination: {
        totalVideos,
        videosPerPage,
        totalPages,
        currentPage: 1,
      },
      error: null,
    };

    // Cache before return
    setCacheData(cacheKey, result);
    return result;
  } catch (error) {
    console.error("YouTube API Error:", error);
    const errorResult = {
      videos: [],
      allVideos: [],
      videosByCategory: {},
      groupedVideos: {},
      error: error instanceof Error ? error.message : "Failed to fetch YouTube data",
    };
    setCacheData(cacheKey, errorResult);
    return errorResult;
  }
}
