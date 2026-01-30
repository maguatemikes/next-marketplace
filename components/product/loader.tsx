"use client";
export default function Loader() {
  return (
    <div className="flex justify-center items-center h-full w-full py-8">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-gray-900"></div>
        <p className="mt-4 text-gray-700 text-sm">Loading products...</p>
      </div>
    </div>
  );
}
