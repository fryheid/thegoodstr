import axios from "axios";
import { useEffect, useState } from "react";
import { Navbar } from "../lib/Navbar";
import ProductOverview, { Product } from "../lib/ProductOverview";

interface RetrieveProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  images: Array<{ src: string }>;
}

export const ProductPage = () => {
  const [product, setProduct] = useState<Product | null>(null);

  const productId = window.location.pathname.split("/")[2];

  const fetchProduct = async () => {
    const PRODUCTS_URL =
      import.meta.env.VITE_BASE_URL + "/products/" + productId;
    const response = await axios.get<RetrieveProductResponse>(PRODUCTS_URL);
    setProduct({
      name: response.data.name,
      price: response.data.price,
      description: response.data.description,
      imageSrc: response.data.images[0].src,
      imageAlt: response.data.name,
    });
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <>
      <Navbar />
      <ProductOverview product={product} />
    </>
  );
};
