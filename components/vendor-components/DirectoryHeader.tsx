import { ViewToggle } from "@/components/vendor-components/ViewToggle";

type ViewMode = "grid" | "map";

interface DirectoryHeaderProps {
  viewMode: ViewMode;
}

export function DirectoryHeader({ viewMode }: DirectoryHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Local Business Directory
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Discover and connect with local stores and sellers in your area
            </p>
          </div>
          <ViewToggle viewMode={viewMode} />
        </div>
      </div>
    </header>
  );
}
