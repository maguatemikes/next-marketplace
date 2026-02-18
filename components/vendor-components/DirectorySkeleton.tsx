export function DirectorySkeleton() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse space-y-4">
        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="h-48 bg-gray-200" />
              <div className="p-6 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-center mt-8">
          <div className="h-10 bg-gray-200 rounded w-64" />
        </div>
      </div>
    </div>
  );
}
