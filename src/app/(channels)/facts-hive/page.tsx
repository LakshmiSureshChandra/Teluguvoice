import { Metadata } from 'next';
import Image from "next/image";
import Link from "next/link";
import { getYoutubeData } from '@/lib/youtube';
import VideoList from './components/VideoList';
import { Suspense } from 'react';
import Loading from './loading';

export const metadata: Metadata = {
  title: 'Facts Hive - Fascinating Facts and Knowledge Sharing | Telugu Voice',
  description: 'Discover fascinating facts and knowledge in Telugu. Watch engaging videos about science, history, technology, and more from Facts Hive channel.',
  keywords: 'Facts Hive, Telugu facts, knowledge sharing, Telugu educational content, interesting facts in Telugu, Telugu science videos',
  openGraph: {
    title: 'Facts Hive - Fascinating Facts and Knowledge Sharing',
    description: 'Explore interesting facts and knowledge in Telugu. Science, history, technology, and more.',
    images: ['/facts hive 2.png'],
    type: 'website',
    locale: 'te_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Facts Hive - Telugu Knowledge Sharing',
    description: 'Discover fascinating facts and knowledge in Telugu',
    images: ['/facts hive 2.png'],
  }
};

// Add JSON-LD structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Facts Hive',
  description: 'Fascinating facts and knowledge sharing channel in Telugu',
  publisher: {
    '@type': 'Organization',
    name: 'Telugu Voice',
    logo: {
      '@type': 'ImageObject',
      url: '/facts hive 2.png'
    }
  }
};

export const revalidate = 21600;

export default async function FactsHivePage() {
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
  const { allVideos, error } = await getYoutubeData('@FactsHive');

  return (
    <div className="min-h-screen bg-[#0c1b33] py-12">
      <div className="container mx-auto px-6">

        {error ? (
          <div className="text-red-500 bg-red-500/10 p-4 rounded-lg">{error}</div>
        ) : (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">Videos of Facts Hive</h2>
            <VideoList allVideos={allVideos} />
          </section>
        )}
      </div>
    </div>
  );
}