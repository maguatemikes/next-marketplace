"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface VendorsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean; // ⭐ New loading prop
}

export function VendorsPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  isLoading = false, // ⭐ Default to false
}: VendorsPaginationProps) {
  return (
    <div className="relative">
      {/* ⭐ Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
          <div className="flex items-center gap-3 bg-white border border-green-200 rounded-lg px-4 py-3 shadow-sm">
            <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
            <span className="text-sm font-medium text-gray-700">
              Loading page {currentPage}...
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-gray-100 rounded-xl p-4">
        {/* Results Info */}
        <div className="text-sm text-gray-600">
          Showing{" "}
          <span className="text-gray-900">
            {(currentPage - 1) * itemsPerPage + 1}
          </span>{" "}
          to{" "}
          <span className="text-gray-900">
            {Math.min(currentPage * itemsPerPage, totalItems)}
          </span>{" "}
          of <span className="text-gray-900">{totalItems}</span> results
        </div>

        {/* Pagination Buttons */}
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="rounded-lg"
          >
            Previous
          </Button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {/* First Page */}
            {currentPage > 2 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(1)}
                  disabled={isLoading}
                  className="rounded-lg w-9 h-9 p-0"
                >
                  1
                </Button>
                {currentPage > 3 && (
                  <span className="text-gray-400 px-1">...</span>
                )}
              </>
            )}

            {/* Previous Page */}
            {currentPage > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={isLoading}
                className="rounded-lg w-9 h-9 p-0"
              >
                {currentPage - 1}
              </Button>
            )}

            {/* Current Page */}
            <Button
              variant="default"
              size="sm"
              className="rounded-lg w-9 h-9 p-0 bg-green-600 hover:bg-green-700 text-white"
            >
              {currentPage}
            </Button>

            {/* Next Page */}
            {currentPage < totalPages && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={isLoading}
                className="rounded-lg w-9 h-9 p-0"
              >
                {currentPage + 1}
              </Button>
            )}

            {/* Last Page */}
            {currentPage < totalPages - 1 && (
              <>
                {currentPage < totalPages - 2 && (
                  <span className="text-gray-400 px-1">...</span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(totalPages)}
                  disabled={isLoading}
                  className="rounded-lg w-9 h-9 p-0"
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="rounded-lg"
          >
            Next
          </Button>
        </div>

        {/* Go to Page Input */}
        <div className="hidden lg:flex items-center gap-2 text-sm">
          <span className="text-gray-600">Go to page:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) {
                onPageChange(page);
              }
            }}
            disabled={isLoading}
            className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}
