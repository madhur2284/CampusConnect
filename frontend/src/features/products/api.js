import apiClient from "../../lib/apiClient";

/**
 * BACKEND CONTRACT (app/routers/product.py, prefix /product):
 * - GET    /product/items?page=<n>      -> PaginatedProductResponse
 *              { page_number, total_pages, has_previous, has_next, data: Product[] }
 * - POST   /product/items (auth)         multipart/form-data:
 *              title (str), price (int), description (str), image (file, required)
 *          -> Product
 * - GET    /product/items/me?page=<n> (auth) -> same paginated shape, only own listings
 * - DELETE /product/items/{product_id} (auth) -> 204 No Content
 *
 * Product shape returned by the backend:
 *   {
 *     id, seller_id, seller_contact_number, seller_name, seller_college,
 *     title, image_url, image_public_id, price, description, created_at
 *   }
 */

export const fetchProducts = async (page = 1) => {
  const { data } = await apiClient.get("/product/items", { params: { page } });
  return data;
};

export const fetchMyProducts = async (page = 1) => {
  const { data } = await apiClient.get("/product/items/me", { params: { page } });
  return data;
};

export const createProduct = async ({ title, price, description, image }) => {
  const form = new FormData();
  form.append("title", title);
  form.append("price", price);
  form.append("description", description ?? "");
  form.append("image", image);

  const { data } = await apiClient.post("/product/items", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteProduct = async (id) => {
  await apiClient.delete(`/product/items/${id}`);
};
