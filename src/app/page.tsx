import Image from "next/image";
import Link from "next/link";
import { Dancing_Script } from 'next/font/google';
import { Metadata } from 'next';

const dancingScript = Dancing_Script({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Telugu Voice - Your Hub for Telugu Entertainment & Knowledge',
  description: 'Discover the best Telugu content - from mystery thrillers and spiritual discourses to fascinating facts. Watch videos from Shadow Madhubabu, Voice of Maheedhar, and Facts Hive.',
  keywords: 'Telugu Voice, Telugu content, Telugu audiobooks, Telugu facts, Telugu spiritual content, Shadow Madhubabu, Voice of Maheedhar, Facts Hive',
  openGraph: {
    title: 'Telugu Voice - Telugu Entertainment & Knowledge Hub',
    description: 'Your one-stop destination for Telugu mystery thrillers, spiritual content, and fascinating facts.',
    images: ['/logo.png'],
    type: 'website',
    locale: 'te_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Telugu Voice - Entertainment & Knowledge Hub',
    description: 'Discover the best Telugu content all in one place',
    images: ['/logo.png'],
  }
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Telugu Voice',
  description: 'Your hub for Telugu entertainment and knowledge content',
  url: 'https://teluguvoice.vercel.app',
  publisher: {
    '@type': 'Organization',
    name: 'Telugu Voice',
    logo: {
      '@type': 'ImageObject',
      url: '/logo.png'
    }
  },
  hasPart: [
    {
      '@type': 'WebPage',
      name: 'Shadow Madhubabu',
      description: 'Telugu mystery thriller audiobooks'
    },
    {
      '@type': 'WebPage',
      name: 'Voice of Maheedhar',
      description: 'Telugu spiritual and devotional content'
    },
    {
      '@type': 'WebPage',
      name: 'Facts Hive',
      description: 'Telugu knowledge and facts channel'
    }
  ]
};

// Add the script to your page component
export default function Home() {
  return (
    <div className="min-h-screen bg-[#0c1b33] flex items-center">
      <div className="absolute inset-0 bg-[url('/kolam-pattern.svg')] bg-repeat-x bg-top opacity-10"></div>
      
      <main className="relative container mx-auto px-6 text-center">
        <h1 className={`text-6xl md:text-7xl font-bold mb-6 relative ${dancingScript.className}`}>
          <span className="text-[#FF9933]">
            Telugu Voice
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
          Discover the enchanting world of Telugu literature and storytelling through 
          our carefully curated collection of premium audiobooks and narratives.
        </p>

        <div className="flex flex-col sm:flex-row gap-8 justify-center items-stretch relative max-w-6xl mx-auto">
          <Link 
            href="/shadow-madhubabu"
            className="group flex-1 transform hover:-translate-y-2 transition-all duration-300 p-6 rounded-3xl bg-black/20 backdrop-blur-sm hover:bg-black/30 text-white shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex flex-col items-center gap-6"
          >
            <div className="relative p-1 bg-gradient-to-r from-white/80 to-gray-400 rounded-full">
              <Image
                src="/Profile Pic.jpg"
                alt="Shadow Madhubabu Audiobooks"
                width={180}
                height={180}
                className="rounded-full grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-white">
                Shadow Madhubabu Audiobooks
              </h2>
              <p className="text-gray-400">Mystery and thriller audiobooks</p>
            </div>
          </Link>

          <Link 
            href="/voice-of-maheedhar"
            className="group flex-1 transform hover:-translate-y-2 transition-all duration-300 p-6 rounded-3xl bg-[#1E293B]/30 backdrop-blur-sm hover:bg-[#1E293B]/40 text-white shadow-[0_8px_30px_rgba(30,41,59,0.2)] hover:shadow-[0_20px_40px_rgba(30,41,59,0.3)] flex flex-col items-center gap-6"
          >
            <div className="relative p-1 bg-gradient-to-r from-[#E2E8F0] to-[#94A3B8] rounded-full">
              <Image
                src="/Logo Square 2.png"
                alt="Voice of Maheedhar"
                width={180}
                height={180}
                className="rounded-full"
              />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-[#E2E8F0]">
                Voice of Maheedhar
              </h2>
              <p className="text-[#94A3B8]">Spiritual and devotional content</p>
            </div>
          </Link>
          
          <Link 
            href="/facts-hive"
            className="group flex-1 transform hover:-translate-y-2 transition-all duration-300 p-6 rounded-3xl bg-[#FFE5D9]/10 backdrop-blur-sm hover:bg-[#FFE5D9]/20 text-white shadow-[0_8px_30px_rgba(255,145,77,0.1)] hover:shadow-[0_20px_40px_rgba(255,145,77,0.2)] flex flex-col items-center gap-6"
          >
            <div className="relative p-1 bg-gradient-to-r from-[#FF914D] via-[#FF5733] to-[#FF3D1F] rounded-full">
              <Image
                src="/facts hive 2.png"
                alt="Facts Hive"
                width={180}
                height={180}
                className="rounded-full object-cover object-center"
                style={{ aspectRatio: '1/1' }}
              />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-[#FF914D]">
                Facts Hive
              </h2>
              <p className="text-[#FFE5D9]">Fascinating facts and knowledge sharing</p>
            </div>
          </Link>
        </div>

        <div className="mt-12">
          <p className="text-white/40 text-base italic">
            "Where tradition meets modern storytelling"
          </p>
        </div>
      </main>
    </div>
  );
}
