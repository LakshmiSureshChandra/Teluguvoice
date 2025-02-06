export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FFE5D9]/5 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6">
          <div className="relative p-1 bg-gradient-to-r from-[#FF914D] via-[#FF5733] to-[#FF3D1F] rounded-full w-24 h-24 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-[#FFE5D9]/20 border-t-[#FF914D] rounded-full animate-spin"></div>
          </div>
          <h1 className="text-2xl font-bold text-[#FF914D]">Facts Hive</h1>
          <p className="text-[#FFE5D9]/80 text-lg">Loading fascinating facts...</p>
        </div>
      </div>
    </div>
  );
}