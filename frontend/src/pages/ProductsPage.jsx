import { Link } from "react-router-dom";
import { useProducts } from "../features/products/useProducts";
import ProductGrid from "../features/products/ProductGrid";
import Spinner from "../components/Spinner";
import Banner from "../components/Banner";
import Button from "../components/Button";
import Pagination from "../components/Pagination";
import { useAuth } from "../features/auth/useAuth";

export default function ProductsPage() {
  const {
    products,
    pageNumber,
    totalPages,
    hasPrevious,
    hasNext,
    setPage,
    loading,
    error,
    reload,
  } = useProducts(1);
  const { isAuthenticated } = useAuth();

  return (
    <div className="corkboard min-h-[calc(100vh-64px)] px-5 pb-16 pt-10">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl rotate-[-1deg] rounded-sm bg-paper px-6 py-5 text-center shadow-pin">
          <p className="font-hand text-lg text-tape">the campus board</p>
          <h1 className="font-display text-4xl text-ink sm:text-5xl">
            CAMPUSCONNECT
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            See something you want? Message the number on the flyer. No cart, no
            checkout &mdash; just sellers and buyers sorting it out directly.
          </p>
          {!isAuthenticated && (
            <div className="mt-4 flex justify-center gap-3">
              <Link to="/register">
                <Button variant="primary">Sign up to sell</Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
            </div>
          )}
        </div>

        {error && (
          <div className="mx-auto mt-8 flex max-w-2xl flex-col items-center gap-3">
            <Banner tone="error" className="w-full bg-paper">
              {error}
            </Banner>
            <Button variant="ghost" onClick={reload}>
              Try again
            </Button>
          </div>
        )}

        {loading ? (
          <Spinner label="Pulling up the board" />
        ) : (
          !error && (
            <>
              <ProductGrid products={products} />
              <Pagination
                pageNumber={pageNumber}
                totalPages={totalPages}
                hasPrevious={hasPrevious}
                hasNext={hasNext}
                onPageChange={setPage}
                className="mt-12"
              />
            </>
          )
        )}
      </div>
    </div>
  );
}
