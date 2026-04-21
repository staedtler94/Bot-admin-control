import React from 'react';

interface PaginationProps {
  limit: number;
  offset: number;
  total: number;
  onPageChange: (offset: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ limit, offset, total, onPageChange }) => {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  const handlePrevious = () => {
    if (offset >= limit) {
      onPageChange(offset - limit);
    }
  };

  const handleNext = () => {
    if (offset + limit < total) {
      onPageChange(offset + limit);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-4 p-4 bg-gray-50 rounded-lg">
      <button
        onClick={handlePrevious}
        disabled={offset === 0}
        className="px-4 py-2 bg-primary text-white rounded disabled:bg-gray-400"
      >
        Previous
      </button>
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={offset + limit >= total}
        className="px-4 py-2 bg-primary text-white rounded disabled:bg-gray-400"
      >
        Next
      </button>
    </div>
  );
};
