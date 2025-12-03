import React, { useState } from "react";
import { Button } from "../../../../../components/ui/button";
import { Pen } from "lucide-react";

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
    <li className={`w-full Todo flex gap-2  items-center p-2 ${quantity<=0?"bg-red-100":""}`}>
      {/* Product Name */}
      <div className="w-full font-medium">{todo.name}</div>

      {/* Selling Price */}
      <div className="w-[120px]">LKR {todo.sellingPrice.toFixed(2)}</div>

      {/* Quantity */}
      <div className={`flex items-center gap-0 w-[100px]`}>
        {isEditing ? (
          <>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-[80px] border px-1"
              min={1}
              max={quantity}
              disabled={quantity<=0?true:false}
            />
            <Button size="sm" onClick={handleUpdate}>
              Save
            </Button>
          </>
        ) : (
          <>
            <span className="w-[80px]">{todo.quantity}</span>
            {quantity<=0?"":<Button size={'sm'}
              onClick={() => setIsEditing(true)}
              className=""
            >
              <Pen className="w-4 h-4"/>
            </Button>}
          </>
        )}
      </div>

      {/* Remove Item */}
      {quantity<=0?<Button
        size="sm"
        className="bg-red-500 hover:bg-red-600 ml-2"
        onClick={() => removeTodo(todo.id)}
        disabled
      >
        x
      </Button>:<Button
        size="sm"
        className="bg-red-500 hover:bg-red-600 ml-2"
        onClick={() => removeTodo(todo.id)}
      >
        x
      </Button>}
    </li>
  );
}
