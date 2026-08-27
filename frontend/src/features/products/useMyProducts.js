import { useCallback, useEffect, useState } from "react";
import { fetchMyProducts, deleteProduct } from "./api";
import { getErrorMessage } from "../../utils/errorMessage";

const EMPTY_PAGE = {
  page_number: 0,
  total_pages: 0,
  has_previous: false,
  has_next: false,
  data: [],
};

export function useMyProducts(initialPage = 1) {
  const [page, setPage] = useState(initialPage);
  const [result, setResult] = useState(EMPTY_PAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(async (pageToLoad) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchMyProducts(pageToLoad);
      setResult(data);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't load your listings."));
      setResult(EMPTY_PAGE);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page);
  }, [page, load]);

  const removeProduct = useCallback(
    async (id) => {
      setDeletingId(id);
      try {
        await deleteProduct(id);
        // If we just deleted the last item on this page, step back a page
        // (unless we're already on page 1); otherwise just reload it.
        const isLastItemOnPage = result.data.length === 1 && page > 1;
        await load(isLastItemOnPage ? page - 1 : page);
        if (isLastItemOnPage) setPage(page - 1);
        return true;
      } catch (err) {
        setError(getErrorMessage(err, "Couldn't delete this listing."));
        return false;
      } finally {
        setDeletingId(null);
      }
    },
    [load, page, result.data.length]
  );

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
    deletingId,
    removeProduct,
    reload: () => load(page),
  };
}
