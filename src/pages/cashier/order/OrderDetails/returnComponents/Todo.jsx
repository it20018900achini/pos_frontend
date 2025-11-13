import React, { useState } from "react";
import { Button } from "../../../../../components/ui/button";

export default function Todo({ todo, toggleComplete, updateTodo, removeTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [quantity, setQuantity] = useState(todo.quantity);

  const handleUpdate = () => {
    if (quantity.trim()) {
      updateTodo(todo.id, quantity.trim());
      setIsEditing(false);
    }
  };

  return (
    <li className="Todo flex gap-1 border-b items-center">
        <div className="w-full">{todo?.name}</div>
        <div className="overflow-x-auto w-[200px]">LKR {todo?.sellingPrice.toFixed(2)}</div>
      {isEditing ? (
        <>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-[100px] border"
          />
          <Button size={'sm'} onClick={handleUpdate}>Save</Button>
        </>
      ) : (
        <>
       
          <span
            style={{ textDecoration: todo.completed ? "line-through" : "none", cursor: "pointer" }}
            
            className="w-[100px]"
          >
            {todo.quantity}
          </span>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => removeTodo(todo.id)}>Delete</button>
        </>
      )}
    </li>
  );
}
