import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import TextArea from "../../components/TextArea";
import Button from "../../components/Button";
import Banner from "../../components/Banner";
import ImageDropInput from "../../components/ImageDropInput";
import { createProduct } from "./api";
import { getErrorMessage } from "../../utils/errorMessage";

const initialForm = {
  title: "",
  price: "",
  description: "",
};

export default function ProductForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleImageChange = (file, error) => {
    setImage(file);
    setErrors((prev) => ({ ...prev, image: error || undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Give it a title.";
    if (!form.price || Number(form.price) <= 0)
      next.price = "Enter a price greater than 0.";
    if (!image) next.image = "Add a photo of the item.";
    setErrors((prev) => ({ ...prev, ...next }));
    return Object.keys(next).length === 0 && !errors.image;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setLoading(true);
    try {
      await createProduct({
        title: form.title,
        price: form.price,
        description: form.description,
        image,
      });
      navigate("/");
    } catch (err) {
      setServerError(getErrorMessage(err, "Couldn't post this listing."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Banner tone="error">{serverError}</Banner>

      <Input
        id="title"
        label="What are you selling?"
        placeholder="e.g. Study Table Lamp"
        value={form.title}
        onChange={handleChange("title")}
        error={errors.title}
      />
      <Input
        id="price"
        label="Price (₹)"
        type="number"
        min="1"
        placeholder="500"
        value={form.price}
        onChange={handleChange("price")}
        error={errors.price}
      />
      <ImageDropInput
        id="image"
        label="Photo"
        value={image}
        onChange={handleImageChange}
        error={errors.image}
      />
      <TextArea
        id="description"
        label="Description"
        rows={3}
        placeholder="Condition, age, why you're selling..."
        value={form.description}
        onChange={handleChange("description")}
      />

      <Banner tone="info">
        Buyers will message you on WhatsApp using the contact number on your
        account — no need to enter it again here.
      </Banner>

      <Button type="submit" loading={loading} className="mt-2 w-full">
        Pin it to the board
      </Button>
    </form>
  );
}
