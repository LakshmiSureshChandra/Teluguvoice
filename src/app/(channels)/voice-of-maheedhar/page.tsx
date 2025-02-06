import { getYoutubeData } from "@/lib/youtube";
import VideoList from "./components/VideoList";
import { Suspense } from "react";
import Loading from "./loading";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Voice of Maheedhar - Telugu Spiritual & Devotional Content | Telugu Voice",
  description:
    "Experience spiritual and devotional content in Telugu by Voice of Maheedhar. Listen to bhajans, spiritual discourses, and divine stories.",
  keywords:
    "Voice of Maheedhar, Telugu spiritual content, devotional songs Telugu, Telugu bhajans, spiritual discourses Telugu, divine stories Telugu",
  openGraph: {
    title: "Voice of Maheedhar - Telugu Spiritual & Devotional Content",
    description:
      "Immerse yourself in Telugu spiritual and devotional content. Bhajans, discourses, and divine stories.",
    images: ["/voice-of-maheedhar.png"],
    type: "website",
    locale: "te_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Voice of Maheedhar - Telugu Spiritual Content",
    description: "Experience divine Telugu spiritual and devotional content",
    images: ["/voice-of-maheedhar.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Voice of Maheedhar",
  description: "Telugu spiritual and devotional content platform",
  publisher: {
    "@type": "Organization",
    name: "Telugu Voice",
    logo: {
      "@type": "ImageObject",
      url: "/voice-of-maheedhar.png",
    },
  },
  about: {
    "@type": "CreativeWork",
    genre: "Spiritual & Devotional",
    inLanguage: "Telugu",
  },
};

export const revalidate = 21600;

export default async function VoiceOfMaheedharPage() {
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
  const { allVideos, error } = await getYoutubeData("@VoiceofMaheedhar");

  return (
    <div className="min-h-screen bg-[#1E293B] py-12">
      <div className="container mx-auto px-6">
        {error ? (
          <div className="text-red-500 bg-red-500/10 p-4 rounded-lg">
            {error}
          </div>
        ) : (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-[#E2E8F0] mb-8">
              Videos of Voice of Maheedhar
            </h2>
            <VideoList allVideos={allVideos ?? []} />
          </section>
        )}
      </div>
    </div>
  );
}
