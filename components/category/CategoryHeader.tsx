"use client";

import { useEffect, useState } from "react";

export default function CategoriesList() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function loadCategories() {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    }
    loadCategories();
  }, []);

  return (
    <section>
      <h2>Categories</h2>
      <ul>
        {categories.map((cat) => (
          <li key={cat.id}>
            <a href={`/category/${cat.slug}`}>{cat.name}</a>
          </li>
        ))}
      </ul>
    </section>
  );
}