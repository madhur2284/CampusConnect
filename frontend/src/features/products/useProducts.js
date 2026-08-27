import { useCallback, useEffect, useState } from "react";
import { fetchProducts } from "./api";
import { getErrorMessage } from "../../utils/errorMessage";

const EMPTY_PAGE = {
  page_number: 0,
  total_pages: 0,
  has_previous: false,
  has_next: false,
  data: [],
};

export function useProducts(initialPage = 1) {
  const [page, setPage] = useState(initialPage);
  const [result, setResult] = useState(EMPTY_PAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (pageToLoad) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchProducts(pageToLoad);
      setResult(data);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't load the board. Try again."));
      setResult(EMPTY_PAGE);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page);
  }, [page, load]);

  return {
    products: result.data,
    pageNumber: result.page_number,
    totalPages: result.total_pages,
    hasPrevious: result.has_previous,
    hasNext: result.has_next,
    page,
    setPage,
    loading,
    error,
    reload: () => load(page),
  };
}
