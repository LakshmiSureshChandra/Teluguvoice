export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0c1b33] py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6">
          <div className="relative p-1 bg-gradient-to-r from-white/80 to-gray-400 rounded-full w-24 h-24 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-gray-700/20 border-t-white rounded-full animate-spin"></div>
          </div>
          <h1 className="text-2xl font-bold text-white">Shadow Madhubabu</h1>
          <p className="text-gray-300/80 text-lg">Loading mystery thrillers...</p>
        </div>
      </div>
    </div>
  );
}