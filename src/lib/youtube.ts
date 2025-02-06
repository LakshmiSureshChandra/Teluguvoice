import { google, youtube_v3 } from "googleapis"; // Import youtube_v3 to use the type for the response

export async function getYoutubeData(channelHandle: string) {
  if (!process.env.YOUTUBE_API_KEY) {
    console.error("No API key found");
    return {
      allVideos: [],
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

    // Type Definitions

    type VideoData = {
      id: string;
      title: string;
      description: string;
      thumbnail: string;
      publishedAt: string;
      month: string;
      year: number;
      isShort: boolean;
      url: string;
    };

    let allVideos: VideoData[] = [];
    let nextPageToken: string | null | undefined = undefined;

    do {
      // Explicitly type the response
      const playlistItemsResponse = await youtube.playlistItems.list({
        part: ["snippet", "contentDetails", "status"],
        playlistId: uploadsPlaylistId,
        maxResults: 50,
        pageToken: nextPageToken,
      });

      // Extract the data property
      const playlistItemsData: youtube_v3.Schema$PlaylistItemListResponse =
        playlistItemsResponse.data;

      if (playlistItemsData.items?.length) {
        const videos = playlistItemsData.items.map(
          (item: youtube_v3.Schema$PlaylistItem) => {
            const publishDate = new Date(item.snippet?.publishedAt || 0);
            const month = publishDate.toLocaleString("default", {
              month: "long",
            });
            const year = publishDate.getFullYear();

            const isShort =
              item.snippet?.title?.toLowerCase().includes("#shorts") ||
              item.snippet?.title?.toLowerCase().includes("short");

            return {
              id: item.contentDetails?.videoId || "",
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
              isShort: !!isShort, // Ensure isShort is boolean
              url: `https://youtube.com/watch?v=${item.contentDetails?.videoId}`,
            };
          }
        );

        allVideos = allVideos.concat(videos);
      }

      nextPageToken = playlistItemsData.nextPageToken;
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
    return {
      videos: allVideos.slice(0, videosPerPage), // First page of videos
      allVideos, // All videos stored here
      videosByCategory, // Videos grouped by category
      groupedVideos, // Videos grouped by category, year, and month
      pagination: {
        totalVideos,
        videosPerPage,
        totalPages,
        currentPage: 1,
      },
      error: null,
    };
  } catch (error) {
    console.error("YouTube API Error:", error);
    return {
      videos: [],
      error:
        error instanceof Error ? error.message : "Failed to fetch YouTube data",
    };
  }
}
