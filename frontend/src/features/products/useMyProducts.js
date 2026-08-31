import { useCallback, useEffect, useRef, useState } from "react";
import { fetchMyProducts, deleteProduct } from "./api";
import { getErrorMessage } from "../../utils/errorMessage";

export function useMyProducts(initialPage = 1) {
  const [page, setPage] = useState(initialPage);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const loadedPagesRef = useRef(new Set());
  const isFetchingRef = useRef(false);

  const load = useCallback(async (pageToLoad, append = false) => {
    const safePage = Number(pageToLoad) || initialPage;

    if (append && loadedPagesRef.current.has(safePage)) return null;
    if (isFetchingRef.current) return null;

    isFetchingRef.current = true;
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    setError("");
    try {
      const data = await fetchMyProducts(safePage);
      setProducts((currentProducts) => {
        const existingIds = new Set(currentProducts.map((product) => product.id));
        const uniqueProducts = data.data.filter(
          (product) => !existingIds.has(product.id)
        );

        return append ? [...currentProducts, ...uniqueProducts] : data.data;
      });

      loadedPagesRef.current.clear();
      loadedPagesRef.current.add(safePage);
      setPage(data.page_number);
      setTotalPages(data.total_pages);
      setHasPrevious(data.has_previous);
      setHasNext(data.has_next);
      return data;
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't load your listings."));
      if (!append) {
        setProducts([]);
        setPage(initialPage);
        setTotalPages(0);
        setHasPrevious(false);
        setHasNext(false);
        loadedPagesRef.current.clear();
      }
      return null;
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  }, [initialPage]);

  useEffect(() => {
    loadedPagesRef.current.clear();
    load(initialPage, false);
  }, [initialPage, load]);

  const loadNextPage = useCallback(() => {
    if (!hasNext || loading || loadingMore) return;
    load(page + 1, true);
  }, [hasNext, load, loading, loadingMore, page]);

  useEffect(() => {
    const handleScroll = () => {
      if (loading || loadingMore || !hasNext) return;

      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const reachedThreshold = scrollTop + window.innerHeight >= scrollHeight * 0.66;

      if (reachedThreshold) {
        loadNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNext, loadNextPage, loading, loadingMore]);

  const removeProduct = useCallback(
    async (id) => {
      setDeletingId(id);
      try {
        await deleteProduct(id);
        loadedPagesRef.current.clear();
        await load(initialPage, false);
        setPage(initialPage);
        return true;
      } catch (err) {
        setError(getErrorMessage(err, "Couldn't delete this listing."));
        return false;
      } finally {
        setDeletingId(null);
      }
    },
    [initialPage, load]
  );

  return {
    products,
    pageNumber: page,
    totalPages,
    hasPrevious,
    hasNext,
    page,
    setPage,
    loading,
    loadingMore,
    error,
    deletingId,
    removeProduct,
    reload: () => load(initialPage, false),
  };
}
