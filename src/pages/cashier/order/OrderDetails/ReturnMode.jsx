import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { createRefund } from "@/Redux Toolkit/features/refund/refundThunks";
import { setCurrentOrder, setPaymentMethod } from "@/Redux Toolkit/features/cart/cartSlice";
import Todo from "./returnComponents/Todo";

const ReturnMode = ({
  showPaymentDialog,
  setShowPaymentDialog,
  setShowReceiptDialog,
  selectedOrder
}) => {
  const { toast } = useToast();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState([]);

  // Sync todos with selectedOrder whenever it changes
  useEffect(() => {
    if (selectedOrder?.items) {
      setTodos(selectedOrder.items.map(item => ({
        id: item.product?.id || item.id,
        quantity: item.quantity,
        name: item.product?.name,
        sellingPrice: item.product?.sellingPrice
      })));
    } else {
      setTodos([]);
    }
  }, [selectedOrder]);

  // Reset todos to original quantities
  const resetTodos = () => {
    if (!selectedOrder?.items) return;
    setTodos(selectedOrder.items.map(item => ({
      id: item.product?.id || item.id,
      quantity: item.quantity,
      name: item.product?.name,
      sellingPrice: item.product?.sellingPrice
    })));
  };

  // Update quantity for a todo item
  const updateTodo = (id, updatedQuantity) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, quantity: updatedQuantity } : todo
    ));
  };

  // Remove a todo item
  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Process the refund
  const processPayment = async () => {
    if (!selectedOrder) return;

    try {
      setLoading(true);

      const orderData = {
        cash: "0.00",
        credit: "0.00",
        totalAmount: todos.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0),
        cashierId: 13,
        orderId: selectedOrder.id,
        customer: selectedOrder.customer,
        items: todos.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          total: item.sellingPrice * item.quantity
        })),
        paymentType: "CASH",
        note: ""
      };

      console.log("Creating refund:", orderData);

      const createdRefund = await dispatch(createRefund(orderData)).unwrap();
      dispatch(setCurrentOrder(createdRefund));

      setShowPaymentDialog(false);
    //   setShowReceiptDialog(true);

      toast({
        title: "Refund Created Successfully",
        description: `Refund #${createdRefund.id} created successfully`,
      });

    } catch (error) {
      console.error("Failed to create refund:", error);
      toast({
        title: "Refund Creation Failed",
        description: error || "Failed to create refund. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={showPaymentDialog}
      onOpenChange={(open) => {
        setShowPaymentDialog(open);
        dispatch(setPaymentMethod("CASH"));
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Refund</DialogTitle>
        </DialogHeader>

        {/* Reset button */}
        <div className="flex justify-end mb-2">
          <Button onClick={resetTodos}>RESET</Button>
        </div>

        {/* Refund items list */}
        <ul className="border p-2">
          {todos.map(todo => (
            <Todo
              key={todo.id}
              todo={todo}
              updateTodo={updateTodo}
              removeTodo={removeTodo}
            />
          ))}
        </ul>

        {/* Footer */}
        <DialogFooter className="mt-4 flex gap-2">
          <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
            Cancel
          </Button>
          {loading ? (
            <Button disabled>Processing...</Button>
          ) : (
            <Button onClick={processPayment}>Complete Refund</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnMode;