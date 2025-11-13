import React, { useState } from "react";
import Todo from "./Todo";
import NewTodoForm from "./NewTodoForm";
import { v4 as uuidv4 } from "uuid";

import "./TodoList.css";
import { Button } from "../../../../../components/ui/button";

function TodoList({selectedOrder}) {
    const orderDetails=selectedOrder?.items.map((i)=>({"id":i?.id,quantity:i?.quantity,"name":i?.product?.name}))
  const [todos, setTodos] = useState(orderDetails);

  // ✅ Add new todo
  const createTodo = (newTodo) => {
    setTodos([...todos, newTodo]);
  };

  // ✅ Remove todo
  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // ✅ Update quantity
  const updateTodo = (id, updatedQuantity) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, quantity: updatedQuantity } : todo
      )
    );
  };

  // ✅ Toggle completed
  const toggleComplete = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div className="TodoList">
      <h1>
        Todo List <span>A simple React Todo App</span>
      </h1>
       {/* <pre>{JSON.stringify(orderDetails,null,2)}</pre> */}
       <div className="flex justify-end"><Button onClick={()=>setTodos(orderDetails)}>RESET</Button></div>
       
     
      {/* {JSON.stringify(selectedOrder,null,2)}  */}

      {/* <NewTodoForm createTodo={createTodo} /> */}

      <ul className="border">
        {todos.map(todo => (
          <Todo
            key={todo.id}
            todo={todo}
            toggleComplete={toggleComplete}
            updateTodo={updateTodo}
            removeTodo={removeTodo}
            selectedOrder={selectedOrder}
          />
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
