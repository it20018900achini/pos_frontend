import React, { useEffect, useState } from "react";
import Todo from "./Todo";
import { Button } from "../../../../../components/ui/button";

import "./TodoList.css";

function TodoList({ selectedOrder }) {
  const [todos, setTodos] = useState([]);

  // Sync todos with selectedOrder whenever it changes
  useEffect(() => {
    if (selectedOrder?.items) {
      setTodos(
        selectedOrder.items.map((i) => ({
          id: i?.id,
          quantity: i?.quantity,
          name: i?.product?.name,
          sellingPrice: i?.product?.sellingPrice,
        }))
      );
    } else {
      setTodos([]);
    }
  }, [selectedOrder]);

  // Reset todos to original quantities
  const resetTodos = () => {
    if (!selectedOrder?.items) return;
    setTodos(
      selectedOrder.items.map((i) => ({
        id: i?.id,
        quantity: i?.quantity,
        name: i?.product?.name,
        sellingPrice: i?.product?.sellingPrice,
      }))
    );
  };

  // Update quantity for a todo item
  const updateTodo = (id, updatedQuantity) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, quantity: updatedQuantity } : todo
      )
    );
  };

  // Remove a todo item
  const removeTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="TodoList">
      <h1>
        Return Items <span>Edit quantities before creating refund</span>
      </h1>

      {/* Reset Button */}
      <div className="flex justify-end mb-2">
        <Button onClick={resetTodos}>RESET</Button>
      </div>

      {/* Refund Items List */}
      <ul className="border p-2">
        {todos.map((todo) => (
          <Todo
            key={todo.id}
            todo={todo}
            updateTodo={updateTodo}
            removeTodo={removeTodo}
          />
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
