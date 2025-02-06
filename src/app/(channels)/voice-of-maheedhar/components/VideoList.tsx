"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import Image from 'next/image';
interface Video {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  isShort: boolean;
}

interface VideoListProps {
  allVideos: Video[];
}
export default function VideoList({ allVideos }: VideoListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const videosPerPage = 12;

  // Add these state variables
  const [activeTab, setActiveTab] = useState("long"); // 'long' or 'shorts'

  // Filter videos based on type and search
  const filteredVideos = allVideos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Updated shorts detection logic
    const isShortVideo = video.title.toLowerCase().includes('#shorts') || 
                        video.description.toLowerCase().includes('#shorts') ||
                        video.isShort;
    
    const matchesType = activeTab === "shorts" ? isShortVideo : !isShortVideo;
    return matchesSearch && matchesType;
  });

  // Add pagination calculation after filtering
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const paginate = async (pageNumber: number) => {
    setIsLoading(true);
    setCurrentPage(pageNumber);
    // Add a longer delay to match the animation
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
  };

  // Add this after the filtering logic
  const sortedVideos = [...filteredVideos].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  // Separate latest video from the rest
  const latestVideo = sortedVideos[0];
  const remainingVideos = sortedVideos.slice(1);

  // Update the currentVideos calculation
  const paginatedVideos = remainingVideos.slice(
    indexOfFirstVideo,
    indexOfLastVideo
  );

  return (
    <>
      {/* Tab buttons with Home button */}
      <div className="flex justify-center items-center gap-4 mb-4">
        <Link
          href="/"
          className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </Link>
        <button
          onClick={() => {
            setActiveTab("long");
            setCurrentPage(1);
          }}
          className={`px-6 py-2 rounded-full transition-colors ${
            activeTab === "long"
              ? "bg-white/20 text-white border border-white/50"
              : "bg-white/10 text-gray-400 hover:bg-white/15 hover:text-white"
          }`}
        >
          Full Episodes
        </button>
        <button
          onClick={() => {
            setActiveTab("shorts");
            setCurrentPage(1);
          }}
          className={`px-6 py-2 rounded-full transition-colors ${
            activeTab === "shorts"
              ? "bg-white/20 text-white border border-white/50"
              : "bg-white/10 text-gray-400 hover:bg-white/15 hover:text-white"
          }`}
        >
          Shorts
        </button>
        <Link
          href="/facts-hive"
          className="w-10 h-10 rounded-full overflow-hidden hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl"
        >
          <Image
            src="/facts hive 2.png"
            alt="Facts Hive"
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </Link>
        <Link
          href="/shadow-madhubabu"
          className="w-10 h-10 rounded-full overflow-hidden hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl"
        >
          <Image
            src="/Profile Pic.jpg"
            alt="Shadow Madhubabu"
            width={40}
            height={40}
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
          />
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search audiobooks..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-3 rounded-lg bg-white/5 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="text-gray-400 text-sm mt-2 text-center">
            Found {filteredVideos.length} audiobook
            {filteredVideos.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Videos Grid */}
      <div className="space-y-4">
        {/* Latest Video Section */}
        {latestVideo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl mx-auto"
          >
            <h3 className="text-white text-lg font-semibold mb-2">
              Latest {activeTab === "shorts" ? "Short" : "Episode"}
            </h3>
            <div className="bg-white/10 rounded-lg overflow-hidden shadow-lg hover:bg-white/15 transition-all duration-300">
              <div className="relative pt-[45%]">
                {" "}
                {/* reduced height ratio */}
                <iframe
                  src={`https://www.youtube.com/embed/${latestVideo.id}?autoplay=0&modestbranding=1&rel=0`}
                  title={latestVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full border-0"
                />
              </div>
              <div className="p-4">
                {" "}
                {/* reduced padding */}
                <h3 className="text-white text-lg font-semibold line-clamp-1">
                  {latestVideo.title}
                </h3>
                <p className="text-gray-300 mt-2 text-sm line-clamp-2">
                  {latestVideo.description}
                </p>
                <p className="text-gray-400 mt-2 text-sm">
                  {new Date(latestVideo.publishedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center mt-4 text-gray-400 animate-bounce">
              <span className="mr-2">Scroll to see more videos</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </motion.div>
        )}

        {/* Regular Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[800px]">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="col-span-full flex justify-center items-center min-h-[60vh]"
              >
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative p-1 bg-gradient-to-r from-white/80 to-gray-400 rounded-full w-24 h-24 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-gray-700/20 border-t-white rounded-full animate-spin"></div>
                  </div>
                  <h1 className="text-2xl font-bold text-white">
                    Shadow Madhubabu
                  </h1>
                  <p className="text-gray-300/80 text-lg">
                    Loading mystery thrillers...
                  </p>
                </div>
              </motion.div>
            ) : (
              <>
                {paginatedVideos.map((video) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="bg-[#FFE5D9]/5 rounded-lg overflow-hidden shadow-lg hover:bg-[#FFE5D9]/10 transition-all duration-300"
                  >
                    {/* Rest of the video card content remains the same */}
                    <div className="relative pt-[56.25%]">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.id}?autoplay=0&modestbranding=1&rel=0`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute top-0 left-0 w-full h-full border-0"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-semibold line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="text-gray-400 mt-2 text-sm line-clamp-3">
                        {video.description}
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        {new Date(video.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-wrap justify-center gap-2 mt-8 mb-8">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className={`px-4 py-2 rounded transition-colors ${
            currentPage === 1 || isLoading
              ? "bg-[#FFE5D9]/5 text-[#FFE5D9]/30"
              : "bg-[#FFE5D9]/10 text-[#FFE5D9] hover:bg-[#FFE5D9]/15"
          }`}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((num) => {
            const range = 2;
            return (
              num === 1 ||
              num === totalPages ||
              (num >= currentPage - range && num <= currentPage + range)
            );
          })
          .map((number, index, array) => {
            if (index > 0 && array[index - 1] !== number - 1) {
              return [
                <span
                  key={`ellipsis-${number}`}
                  className="px-4 py-2 text-gray-500"
                >
                  ...
                </span>,
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded transition-colors ${
                    currentPage === number
                      ? "bg-black/40 text-white border border-gray-700"
                      : "bg-black/30 text-white hover:bg-black/40"
                  }`}
                >
                  {number}
                </button>,
              ];
            }
            return (
              <button
                key={number}
                onClick={() => paginate(number)}
                disabled={isLoading}
                className={`px-4 py-2 rounded transition-colors ${
                  currentPage === number
                    ? "bg-black/40 text-white border border-gray-700"
                    : "bg-black/30 text-white hover:bg-black/40"
                }`}
              >
                {number}
              </button>
            );
          })}

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className={`px-4 py-2 rounded transition-colors ${
            currentPage === totalPages || isLoading
              ? "bg-[#FFE5D9]/5 text-[#FFE5D9]/30"
              : "bg-[#FFE5D9]/10 text-[#FFE5D9] hover:bg-[#FFE5D9]/15"
          }`}
        >
          Next
        </button>
      </div>
    </>
  );
}
