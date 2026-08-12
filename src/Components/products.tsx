"use client";

import { useEffect, useState } from "react";
import { productApi, Product } from "@/lib/api";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productApi
      .getAll()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      <h1>পণ্যসমূহ</h1>

      {loading && <p>লোড হচ্ছে...</p>}

      {!loading && products.length === 0 && (
        <div
          style={{
            border: "1px dashed #ccc",
            borderRadius: 8,
            padding: 40,
            textAlign: "center",
            color: "#666",
          }}
        >
          কোনো পণ্য পাওয়া যায়নি।
        </div>
      )}

      {!loading && products.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 12,
              }}
            >
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 6 }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: 140,
                    background: "#f0f0f0",
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#999",
                  }}
                >
                  ছবি নেই
                </div>
              )}

              <h3 style={{ margin: "10px 0 4px", fontSize: 16 }}>{product.name}</h3>
              {product.description && (
                <p style={{ fontSize: 13, color: "#666", margin: "0 0 6px" }}>{product.description}</p>
              )}
              <p style={{ fontWeight: "bold", margin: "0 0 4px" }}>৳ {product.price}</p>
              <p style={{ fontSize: 13, color: "#666", margin: 0 }}>স্টক: {product.stock}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}