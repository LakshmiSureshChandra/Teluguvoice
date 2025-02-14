import Image from "next/image";
import Link from "next/link";
import { Dancing_Script } from "next/font/google";
import { Metadata } from "next";
import { getChannelStats } from "@/lib/youtube";

const dancingScript = Dancing_Script({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Telugu Voice - Your Hub for Telugu Entertainment & Knowledge",
  description:
    "Discover the best Telugu content - from mystery thrillers and spiritual discourses to fascinating facts. Watch videos from Shadow Madhubabu, Voice of Maheedhar, and Facts Hive.",
  keywords:
    "Telugu Voice, Telugu content, Telugu audiobooks, Telugu facts, Telugu spiritual content, Shadow Madhubabu, Voice of Maheedhar, Facts Hive",
  openGraph: {
    title: "Telugu Voice - Telugu Entertainment & Knowledge Hub",
    description:
      "Your one-stop destination for Telugu mystery thrillers, spiritual content, and fascinating facts.",
    images: ["/logo.png"],
    type: "website",
    locale: "te_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Telugu Voice - Entertainment & Knowledge Hub",
    description: "Discover the best Telugu content all in one place",
    images: ["/logo.png"],
  },
};

// Add the script to your page component
// Add this function to format numbers
function formatNumber(num: string): string {
  const n = parseInt(num);
  if (n >= 1000000) {
    return `${(n / 1000000).toFixed(1)}M`;
  }
  if (n >= 1000) {
    return `${(n / 1000).toFixed(1)}K`;
  }
  return n.toString();
}

// Update the Home component to be async
export default async function Home() {
  // Fetch subscriber counts
  const [maheedharStats, factsHiveStats, shadowStats] = await Promise.all([
    getChannelStats("UCSt52ackN3gdHpNsdhdNfzQ"),
    getChannelStats("UCPEkU0NHJMC2lm77hHncNqw"),
    getChannelStats("UCezP-lhxuxfRrZJlMFX8naQ"),
  ]);

  return (
    <div className="min-h-screen bg-[#0c1b33] flex items-center">
      <div className="absolute inset-0 bg-[url('/kolam-pattern.svg')] bg-repeat-x bg-top opacity-10"></div>

      <main className="relative container mx-auto px-6 text-center my-20">
        <h1
          className={`text-6xl md:text-7xl font-bold mb-6 relative ${dancingScript.className}`}
        >
          <span className="text-[#FF9933]">Telugu Voice</span>
        </h1>

        <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
          Discover the enchanting world of Telugu literature and storytelling
          through our carefully curated collection of premium audiobooks and
          narratives.
        </p>

        <div className="flex flex-col sm:flex-row gap-8 justify-center items-stretch relative max-w-6xl mx-auto">
          <Link
            href="/voice-of-maheedhar"
            className="group flex-1 transform hover:-translate-y-2 transition-all duration-300 p-6 rounded-3xl bg-[#2A4365]/50 backdrop-blur-md hover:bg-[#2A4365]/70 text-white shadow-[0_8px_30px_rgba(30,41,59,0.3),_0_0_15px_rgba(226,232,240,0.15)] hover:shadow-[0_20px_40px_rgba(30,41,59,0.5),_0_0_25px_rgba(226,232,240,0.25)] flex flex-col items-center gap-6"
          >
            <div className="relative p-1 bg-gradient-to-r from-[#E2E8F0] to-[#94A3B8] rounded-full group-hover:from-[#F8FAFC] group-hover:to-[#CBD5E1] transition-all duration-300">
              <Image
                src="/Logo Square 2.png"
                alt="Voice of Maheedhar"
                width={180}
                height={180}
                className="rounded-full transform group-hover:scale-105 transition-all duration-300"
              />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-[#E2E8F0] group-hover:text-white transition-colors duration-300">
                Voice of Maheedhar
              </h2>
              <p className="text-[#94A3B8] group-hover:text-[#CBD5E1] transition-colors duration-300">
                Spiritual and devotional content
              </p>
              <p className="text-[#94A3B8] group-hover:text-[#CBD5E1] transition-colors duration-300 text-sm">
                {formatNumber(maheedharStats.subscriberCount)} subscribers
              </p>
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
                style={{ aspectRatio: "1/1" }}
              />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-[#FF914D]">Facts Hive</h2>
              <p className="text-[#FFE5D9]">
                Fascinating facts and knowledge sharing
              </p>
              <p className="text-[#FFE5D9] text-sm">
                {formatNumber(factsHiveStats.subscriberCount)} subscribers
              </p>
            </div>
          </Link>

          <Link
            href="/shadow-madhubabu"
            className="group flex-1 transform hover:-translate-y-2 transition-all duration-300 p-6 rounded-3xl bg-[#2C2C2C]/50 backdrop-blur-md hover:bg-[#2C2C2C]/70 text-white shadow-[0_8px_30px_rgba(75,75,75,0.3),_0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_20px_40px_rgba(75,75,75,0.4),_0_0_25px_rgba(255,255,255,0.15)] flex flex-col items-center gap-6"
          >
            <div className="relative p-1 bg-gradient-to-r from-[#4A4A4A] to-[#2C2C2C] rounded-full group-hover:from-[#666666] group-hover:to-[#404040] transition-all duration-300">
              <Image
                src="/Profile Pic.jpg"
                alt="Shadow Madhubabu Audiobooks"
                width={180}
                height={180}
                className="rounded-full grayscale hover:grayscale-0 transform group-hover:scale-105 transition-all duration-300"
              />
            </div>
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-[#CCCCCC] group-hover:text-white transition-colors duration-300">
                Shadow Madhubabu audiobooks
              </h2>
              <p className="text-[#808080] group-hover:text-[#A3A3A3] transition-colors duration-300">
                Mystery and thriller audiobooks
              </p>
              <p className="text-[#808080] group-hover:text-[#A3A3A3] transition-colors duration-300 text-sm">
                {formatNumber(shadowStats.subscriberCount)} subscribers
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-12">
          <p className="text-white/40 text-base italic">
            &quot;Where tradition meets modern storytelling&quot;
          </p>
        </div>
      </main>
    </div>
  );
}
