import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import {
  selectTotal,
  setCurrentOrder,
  setPaymentMethod,
} from "@/Redux Toolkit/features/cart/cartSlice";
import { useToast } from "@/components/ui/use-toast";
import { useDispatch } from "react-redux";
import { createRefund } from "@/Redux Toolkit/features/refund/refundThunks";
import { Input } from "@/components/ui/input";
import TodoList from "./returnComponents/TodoList";
import Todo from "./returnComponents/Todo";

const ReturnMode = ({
  showPaymentDialog,
  setShowPaymentDialog,
  setShowReceiptDialog,
  selectedOrder
}) => {
  
  const { toast } = useToast();
  const dispatch = useDispatch();

  const [loading, setLoading] = React.useState(false);

  const processPayment = async () => {
    


    try {
      setLoading(true);

      // Prepare order data according to OrderDTO structure
      const orderData = {
    "cash": "130.00",
    "credit": "0.00",
    "totalAmount": 130,
    "cashierId": 13,
    "orderId": 62,
    "customer": {
        "id": 2,
        "fullName": "Nuwan",
        "email": "",
        "phone": "704238939",
        "createdAt": "2025-10-29T15:10:55.658543",
        "updatedAt": "2025-10-29T15:10:55.658543"
    },
    "items": [
        {
            "productId": 52,
            "quantity": 1,
            "total": null
        }
    ],
    "paymentType": "CASH",
    "note": ""
};

      console.log("Creating order:", orderData);

      // Create order
      const createdOrder = await dispatch(createRefund(orderData)).unwrap();
      dispatch(setCurrentOrder(createdOrder));

      setShowPaymentDialog(false);

      setShowReceiptDialog(true);

      toast({
        title: "Order Created Successfully",
        description: `Order #${createdOrder.id} created and payment processed`,
      });

      setLoading(false);
    } catch (error) {
      console.error("Failed to create order:", error);
      toast({
        title: "Order Creation Failed",
        description: error || "Failed to create order. Please try again.",
        variant: "destructive",
      });
    }
  };

 
//   git config --global user.name "it20018900achini"
// git config --global user.email "achininirupama98@gmail.com"

  const orderDetails=selectedOrder?.items.map((i)=>({"id":i?.id,quantity:i?.quantity,"name":i?.product?.name,"sellingPrice":i?.product?.sellingPrice}))
  const [todos, setTodos] = useState(orderDetails);

  // ✅ Add new todo
  

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
    <Dialog
      open={showPaymentDialog}
      onOpenChange={(showPaymentDialog) => {
        setShowPaymentDialog(showPaymentDialog);
        
        ()=>dispatch(setPaymentMethod("CASH"))
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Refund</DialogTitle>
        </DialogHeader>
{/* <TodoList selectedOrder={selectedOrder}/> */}

{/* {JSON.stringify(orderDetails)} */}
       <div className="flex justify-end"><Button onClick={()=>setTodos(orderDetails)}>RESET</Button></div>

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

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
            Cancel
          </Button>
          {loading ? (
            <Button disabled>Processing...</Button>
          ) : (
            <Button onClick={processPayment}>Complete Payment</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnMode;
