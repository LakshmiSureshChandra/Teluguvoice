import { getYoutubeData, VideoData } from "@/lib/youtube";
import VideoList from "./components/VideoList";
import { Suspense } from "react";
import Loading from "./loading";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shadow Madhubabu - Telugu Mystery Thriller Audiobooks | Telugu Voice",
  description:
    "Listen to captivating Telugu mystery thriller audiobooks by Shadow Madhubabu. Enjoy detective stories, crime thrillers, and suspense novels in Telugu.",
  keywords:
    "Shadow Madhubabu, Telugu audiobooks, mystery thrillers, Telugu detective stories, crime novels Telugu, Telugu suspense stories",
  openGraph: {
    title: "Shadow Madhubabu - Telugu Mystery Thriller Audiobooks",
    description:
      "Immerse yourself in thrilling Telugu mystery audiobooks and detective stories.",
    images: ["/shadow-madhubabu.png"],
    type: "website",
    locale: "te_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shadow Madhubabu - Telugu Mystery Audiobooks",
    description: "Listen to thrilling Telugu mystery and detective stories",
    images: ["/shadow-madhubabu.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Shadow Madhubabu",
  description: "Telugu mystery thriller audiobooks and detective stories",
  publisher: {
    "@type": "Organization",
    name: "Telugu Voice",
    logo: {
      "@type": "ImageObject",
      url: "/shadow-madhubabu.png",
    },
  },
  about: {
    "@type": "AudioBook",
    genre: "Mystery Thriller",
    inLanguage: "Telugu",
  },
};

export const revalidate = 21600;

export default async function ShadowMadhubabuPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<Loading />}>
        <MainContent />
      </Suspense>
    </>
  );
}

async function MainContent() {
  const { allVideos, error } = await getYoutubeData("@ShadowMB");

  return (
    <div className="min-h-screen bg-[#0c1b33] py-12">
      <div className="container mx-auto px-6">
        {error ? (
          <div className="text-red-500 bg-red-500/10 p-4 rounded-lg">
            {error}
          </div>
        ) : (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">
              Videos of Shadow Madhubabu Audiobooks
            </h2>
            <VideoList allVideos={allVideos as VideoData[] ?? []} />
          </section>
        )}
      </div>
    </div>
  );
}
