import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateRefundMutation } from "@/Redux Toolkit/features/refund/refundApi";
import { useToast } from "@/components/ui/use-toast";

const RefundModal = ({ open, order, onClose, onSubmit }) => {
  const { toast } = useToast();
  const [createRefund, { isLoading }] = useCreateRefundMutation();

  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [refundItems, setRefundItems] = useState([]);

  useEffect(() => {
    if (order) {
      setRefundItems([]);
      setPaymentMethod("CASH");
    }
  }, [order]);

  if (!order) return null;

  /**
   * ✅ IMPORTANT
   * Refund options must come ONLY from order.items
   * NOT from product.variants
   */
  const refundOptions = order.items.map((item) => ({
    orderItemId: item.id,
    variantId: item.productVariantId,
    productName: item.product?.name,
    originalQty: item.quantity,
    refundedQty: item.refundedQuantity || 0,
    maxQty: item.quantity - (item.refundedQuantity || 0),
  }));

  const toggleItem = (option) => {
    const exists = refundItems.find(
      (i) => i.orderItemId === option.orderItemId
    );

    if (exists) {
      setRefundItems(
        refundItems.filter((i) => i.orderItemId !== option.orderItemId)
      );
    } else {
      setRefundItems([
        ...refundItems,
        { ...option, quantity: 1, reason: "" },
      ]);
    }
  };

  const updateItem = (orderItemId, field, value) => {
    setRefundItems((prev) =>
      prev.map((i) =>
        i.orderItemId === orderItemId ? { ...i, [field]: value } : i
      )
    );
  };

  const submit = async () => {
    if (refundItems.length === 0) {
      toast({ title: "No items selected", variant: "destructive" });
      return;
    }

    for (const item of refundItems) {
      if (
        !item.quantity ||
        item.quantity <= 0 ||
        item.quantity > item.maxQty
      ) {
        toast({
          title: `Invalid quantity for ${item.productName}`,
          variant: "destructive",
        });
        return;
      }

      if (!item.reason || item.reason.trim() === "") {
        toast({
          title: `Reason required for ${item.productName}`,
          variant: "destructive",
        });
        return;
      }
    }

    const payload = {
      orderId: order.id,
      paymentMethod,
      items: refundItems.map((i) => ({
        productVariantId: i.variantId,
        quantity: Number(i.quantity),
        reason: i.reason,
      })),
    };

    try {
      const result = await createRefund(payload).unwrap();
      toast({ title: "Refund processed successfully" });
      onSubmit(result);
      onClose();
    } catch (err) {
      toast({
        title: "Refund failed",
        description: err?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Refund Order #{order.id}</DialogTitle>
        </DialogHeader>

        {/* Payment Method */}
        <div className="mt-2">
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="CASH">Cash</option>
            <option value="CARD">Card</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
          </select>
        </div>

        {/* Refund Items */}
        <div className="mt-4 space-y-4 max-h-[400px] overflow-y-auto">
          {refundOptions.map((option) => {
            const selected = refundItems.find(
              (i) => i.orderItemId === option.orderItemId
            );

            return (
              <div key={option.orderItemId} className="border p-3 rounded">
                <div className="flex gap-3 items-center">
                  
                  <Checkbox
                    checked={!!selected}
                    disabled={option.maxQty <= 0}
                    onCheckedChange={() => toggleItem(option)}
                  />
                  <div>
                    <p className="font-medium">
                      {option.productName} — Variant #{option.variantId}
                      {option.maxQty <= 0 && (
                        <span className="ml-2 text-xs text-red-500">
                          (Fully Refunded)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Purchased: {option.originalQty} | Refunded:{" "}
                      {option.refundedQty} | Available: {option.maxQty}
                    </p>
                  </div>
                </div>

                {selected && option.maxQty > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <Input
                      type="number"
                      min={1}
                      max={option.maxQty}
                      value={selected.quantity}
                      onChange={(e) => {
                        const val = Math.max(
                          1,
                          Math.min(
                            option.maxQty,
                            parseInt(e.target.value) || 1
                          )
                        );
                        updateItem(option.orderItemId, "quantity", val);
                      }}
                    />
                    <Textarea
                      placeholder="Refund reason"
                      value={selected.reason}
                      onChange={(e) =>
                        updateItem(
                          option.orderItemId,
                          "reason",
                          e.target.value
                        )
                      }
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={submit}
            disabled={
              isLoading ||
              refundItems.length === 0 ||
              refundItems.some(
                (i) => i.quantity <= 0 || i.quantity > i.maxQty
              )
            }
          >
            {isLoading ? "Processing..." : "Process Refund"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RefundModal;
