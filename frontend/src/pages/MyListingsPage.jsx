import { Link } from "react-router-dom";
import { useMyProducts } from "../features/products/useMyProducts";
import ProductGrid from "../features/products/ProductGrid";
import Spinner from "../components/Spinner";
import Banner from "../components/Banner";
import Button from "../components/Button";

export default function MyListingsPage() {
  const {
    products,
    loading,
    loadingMore,
    error,
    deletingId,
    removeProduct,
  } = useMyProducts(1);

  const handleDelete = async (product) => {
    if (!window.confirm(`Remove "${product.title}" from the board?`)) return;
    await removeProduct(product.id);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-paper-aged px-5 pb-16 pt-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="font-hand text-lg text-tape">your pinboard</p>
            <h1 className="font-display text-3xl text-ink sm:text-4xl">
              My Listings
            </h1>
          </div>
          <Link to="/sell">
            <Button variant="primary">Post a new item</Button>
          </Link>
        </div>

        {error && <Banner tone="error" className="mt-6">{error}</Banner>}

        {loading ? (
          <Spinner label="Fetching your listings" />
        ) : (
          <>
            <ProductGrid
              products={products}
              tone="light"
              emptyTitle="You haven't posted anything yet"
              emptyDescription="Pin your first item so campus can see it."
              renderActions={(product) => (
                <Button
                  variant="ghost"
                  className="!w-full !border-pin/40 !text-pin"
                  loading={deletingId === product.id}
                  onClick={() => handleDelete(product)}
                >
                  Remove listing
                </Button>
              )}
            />
            {loadingMore && (
              <div className="mt-8">
                <Spinner label="Loading more listings" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
