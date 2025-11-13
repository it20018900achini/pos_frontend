import React, { useState } from "react";
import { Button } from "../../../../../components/ui/button";

export default function Todo({ todo, updateTodo, removeTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [quantity, setQuantity] = useState(todo.quantity);

  const handleUpdate = () => {
    if (quantity && quantity > 0) {
      updateTodo(todo.id, Number(quantity));
      setIsEditing(false);
    }
  };

  return (
    <li className="Todo flex gap-2 border-b items-center p-2">
      {/* Product Name */}
      <div className="w-full font-medium">{todo.name}</div>

      {/* Selling Price */}
      <div className="w-[120px]">LKR {todo.sellingPrice.toFixed(2)}</div>

      {/* Quantity */}
      <div className="flex items-center gap-1">
        {isEditing ? (
          <>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-[80px] border px-1"
              min={1}
              max={quantity}
            />
            <Button size="sm" onClick={handleUpdate}>
              Save
            </Button>
          </>
        ) : (
          <>
            <span className="w-[80px]">{todo.quantity}</span>
            <button
              onClick={() => setIsEditing(true)}
              className="text-orange-500 hover:underline"
            >
              Edit
            </button>
          </>
        )}
      </div>

      {/* Remove Item */}
      <Button
        size="sm"
        className="bg-red-500 hover:bg-red-600 ml-2"
        onClick={() => removeTodo(todo.id)}
      >
        x
      </Button>
    </li>
  );
}
