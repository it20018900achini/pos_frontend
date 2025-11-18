import React from "react";
import { Button } from "@/components/ui/button";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage + 1 === totalPages;

  return (
    <div className="flex items-center justify-center gap-3 py-4">
      <Button
        variant="outline"
        disabled={isFirstPage}
        onClick={() => onPageChange(0)}
      >
        First
      </Button>

      <Button
        variant="outline"
        disabled={isFirstPage}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </Button>

      <span className="text-sm font-medium">
        Page {currentPage + 1} of {totalPages}
      </span>

      <Button
        variant="outline"
        disabled={isLastPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>

      <Button
        variant="outline"
        disabled={isLastPage}
        onClick={() => onPageChange(totalPages - 1)}
      >
        Last
      </Button>
    </div>
  );
}
