import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function NewTodoForm({ createTodo }) {
  const [quantity, setQuantity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!quantity.trim()) return;

    createTodo({
      id: uuidv4(),
      quantity: quantity.trim(),
      completed: false
    });

    setQuantity("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter a new quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <button type="submit">Add Todo</button>
    </form>
  );
}
