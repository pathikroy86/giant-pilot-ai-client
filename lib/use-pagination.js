"use client";

import { useMemo, useState } from "react";

export function usePagination(items, pageSize = 6) {
  const [page, setPage] = useState(1);
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  const changePage = (nextPage) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  return {
    items: paginatedItems,
    page: currentPage,
    pageSize,
    totalItems,
    totalPages,
    setPage: changePage,
  };
}
