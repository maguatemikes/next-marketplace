import { use } from "react";
import { DirectoryLayout } from "./DirectoryLayout";
import { DirectoryItem } from "./DirectoryCard";
import { MapView } from "./MapView";
import { DirectoryPagination } from "./DirectoryPagination";

type ViewMode = "grid" | "map";

interface DirectoryResponse {
  data: DirectoryItem[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
}

interface DirectoryContentProps {
  viewMode: ViewMode;
  promise: Promise<DirectoryResponse>;
}

export function DirectoryContent({ viewMode, promise }: DirectoryContentProps) {
  // Unwrap the promise using React.use()
  const { data, pagination } = use(promise);

  // Calculate showing range
  const { currentPage, perPage, total } = pagination;
  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, total);

  if (viewMode === "grid") {
    return (
      <div className="space-y-6">
        {/* Pagination Info Bar */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {startItem}-{endItem} of {total} businesses
          </span>
          <span>
            Page {currentPage} of {pagination.totalPages}
          </span>
        </div>

        <DirectoryLayout data={data} viewMode={viewMode} />
        <DirectoryPagination
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
        />
      </div>
    );
  }

  // Map View: Split layout with cards on left and map on right
  return (
    <div className="space-y-6">
      {/* Pagination Info Bar */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {startItem}-{endItem} of {total} businesses
        </span>
        <span>
          Page {currentPage} of {pagination.totalPages}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: Cards Grid (2 columns) */}
        <div>
          <DirectoryLayout data={data} viewMode={viewMode} />
        </div>

        {/* Right: Map */}
        <MapView items={data} />
      </div>

      <DirectoryPagination
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
      />
    </div>
  );
}
