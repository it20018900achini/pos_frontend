// src/components/InventoryForm.jsx
import React, { useState, useEffect } from "react";

const InventoryForm = ({ initialData, onSubmit }) => {
  const [form, setForm] = useState({ productId: "", quantity: 0, id: null });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ productId: "", quantity: 0, id: null });
  };

  return (
    <form className="border p-4 mb-4" onSubmit={handleSubmit}>
      <input
        type="number"
        name="productId"
        placeholder="Product ID"
        value={form.productId}
        onChange={handleChange}
        className="border p-1 mr-2"
        required
      />
      <input
        type="number"
        name="quantity"
        placeholder="Quantity"
        value={form.quantity}
        onChange={handleChange}
        className="border p-1 mr-2"
        required
      />
      <button className="bg-blue-500 text-white px-2 py-1 rounded">
        {form.id ? "Update" : "Create"}
      </button>
    </form>
  );
};

export default InventoryForm;
