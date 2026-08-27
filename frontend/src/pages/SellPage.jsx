import AuthLayout from "../components/AuthLayout";
import ProductForm from "../features/products/ProductForm";

export default function SellPage() {
  return (
    <AuthLayout title="Post an item" subtitle="pin it up for the campus to see">
      <ProductForm />
    </AuthLayout>
  );
}
