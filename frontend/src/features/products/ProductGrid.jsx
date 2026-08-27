import ProductCard from "./ProductCard";
import EmptyState from "../../components/EmptyState";

export default function ProductGrid({ products, emptyTitle, emptyDescription, tone = "dark", renderActions }) {
  if (!products.length) {
    return (
      <EmptyState
        title={emptyTitle || "Nothing pinned up yet"}
        description={emptyDescription || "Be the first to post something for sale."}
        tone={tone}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 pt-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          actions={renderActions ? renderActions(product) : null}
        />
      ))}
    </div>
  );
}
