"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react"; // ✅ ADD: useState, useEffect
import { Button } from "@/components/ui/button";

export function DirectoryPagination({
  totalPages,
  totalItems,
  itemsPerPage = 9, // ✅ FIX 1: Make this a prop with default
}: {
  totalPages: number;
  totalItems: number;
  itemsPerPage?: number; // ✅ FIX 1: Add to interface
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentPage = Number(searchParams.get("page")) || 1;

  // ✅ FIX 2: Add controlled input state
  const [inputValue, setInputValue] = useState(currentPage.toString());

  // ✅ FIX 2: Sync input when page changes
  useEffect(() => {
    setInputValue(currentPage.toString());
  }, [currentPage]);

  // ✅ FIX 3: Hide pagination if not needed
  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || isPending || page === currentPage)
      return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());

    startTransition(() => {
      router.replace(`/vendors?${params.toString()}`, { scroll: false });
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  // ✅ FIX 2: Add input submit handler
  const handleInputSubmit = (value: string) => {
    const page = parseInt(value);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      handlePageChange(page);
    } else {
      setInputValue(currentPage.toString()); // Reset invalid input
    }
  };

  return (
    <div
      className={`w-full transition-opacity ${isPending ? "opacity-50 pointer-events-none" : "opacity-100"}`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-gray-100 rounded-xl p-4">
        {/* Results Info */}
        <div className="text-sm text-gray-600">
          Showing{" "}
          <span className="text-gray-900 font-medium">
            {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
          </span>{" "}
          to{" "}
          <span className="text-gray-900 font-medium">
            {Math.min(currentPage * itemsPerPage, totalItems)}
          </span>{" "}
          of <span className="text-gray-900 font-medium">{totalItems}</span>{" "}
          results
        </div>

        {/* Pagination Buttons */}
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isPending}
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
                  onClick={() => handlePageChange(1)}
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
                onClick={() => handlePageChange(currentPage - 1)}
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
              disabled // ✅ FIX 4: Disable current page button
            >
              {currentPage}
            </Button>

            {/* Next Page */}
            {currentPage < totalPages && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
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
                  onClick={() => handlePageChange(totalPages)}
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
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isPending}
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
            value={inputValue} // ✅ FIX 5: Change to controlled input
            onChange={(e) => setInputValue(e.target.value)} // ✅ FIX 5: Add onChange
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleInputSubmit(inputValue); // ✅ FIX 5: Use handler
              }
            }}
            onBlur={() => handleInputSubmit(inputValue)} // ✅ FIX 5: Submit on blur
            disabled={isPending} // ✅ FIX 5: Disable during loading
            className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50" // ✅ ADD: disabled:opacity-50
          />
        </div>
      </div>
    </div>
  );
}
