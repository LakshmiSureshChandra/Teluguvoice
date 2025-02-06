export default function Loading() {
  return (
    <div className="min-h-screen bg-[#1E293B] py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6">
          <div className="relative p-1 bg-gradient-to-r from-[#E2E8F0] to-[#94A3B8] rounded-full w-24 h-24 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-[#334155]/20 border-t-[#E2E8F0] rounded-full animate-spin"></div>
          </div>
          <h1 className="text-2xl font-bold text-[#E2E8F0]">Voice of Maheedhar</h1>
          <p className="text-[#94A3B8]/80 text-lg">Loading spiritual content...</p>
        </div>
      </div>
    </div>
  );
}