import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateRefundMutation } from "@/Redux Toolkit/features/refund/refundApi";
import { useToast } from "@/components/ui/use-toast";

const RefundModal = ({ open, order, onClose, onSubmit }) => {
  const { toast } = useToast();
  const [createRefund, { isLoading }] = useCreateRefundMutation();

  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [refundItems, setRefundItems] = useState([]);

  // Reset when order changes
  useEffect(() => {
    if (order) {
      setRefundItems([]);
      setPaymentMethod("CASH");
    }
  }, [order]);

  if (!order) return null;

  const toggleItem = (item) => {
    const exists = refundItems.find((i) => i.itemId === item.id);
    if (exists) {
      setRefundItems(refundItems.filter((i) => i.itemId !== item.id));
    } else {
      setRefundItems([
        ...refundItems,
        {
          itemId: item.id,
          productVariantId: "",
          quantity: 1,
          reason: "",
          maxQty: item.quantity,
        },
      ]);
    }
  };

  const updateItem = (itemId, field, value) => {
    setRefundItems((prev) =>
      prev.map((i) => (i.itemId === itemId ? { ...i, [field]: value } : i))
    );
  };

  const submit = async () => {
    if (refundItems.length === 0) {
      toast({ title: "No items selected", variant: "destructive" });
      return;
    }

    // Build payload
    const payload = {
      orderId: order.id,
      paymentMethod,
      items: refundItems.map((i) => ({
        productVariantId: Number(i.productVariantId),
        quantity: Number(i.quantity),
        reason: i.reason,
      })),
    };

    try {
      const result = await createRefund(payload).unwrap();
      toast({ title: "Refund successful" });
      onSubmit(result); // pass the updated order back
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
        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
          <SelectTrigger>
            <SelectValue placeholder="Select Payment Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CASH">Cash</SelectItem>
            <SelectItem value="CARD">Card</SelectItem>
            <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
          </SelectContent>
        </Select>

        {/* Refund Items */}
        <div className="mt-4 space-y-4 max-h-[400px] overflow-y-auto">
          {order.items.map((item) => {
            const selected = refundItems.find((i) => i.itemId === item.id);

            return (
              <div key={item.id} className="border p-3 rounded">
                <div className="flex gap-3 items-center">
                  <Checkbox
                    checked={!!selected}
                    onCheckedChange={() => toggleItem(item)}
                  />
                  <div>
                    <p className="font-medium">{item.product?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>

                {selected && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {/* Variant Selector */}
                    <Select
                      value={selected.productVariantId}
                      onValueChange={(v) =>
                        updateItem(item.id, "productVariantId", v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Variant" />
                      </SelectTrigger>
                      <SelectContent>
                        {item.product.variants.map((v) => (
                          <SelectItem key={v.id} value={String(v.id)}>
                            {v.name || `Variant #${v.id}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Quantity */}
                    <Input
                      type="number"
                      min={1}
                      max={item.quantity}
                      value={selected.quantity}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "quantity",
                          Math.min(item.quantity, e.target.value)
                        )
                      }
                    />

                    {/* Reason */}
                    <Textarea
                      placeholder="Reason"
                      value={selected.reason}
                      onChange={(e) =>
                        updateItem(item.id, "reason", e.target.value)
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
              refundItems.length === 0 ||
              refundItems.some((i) => !i.productVariantId) ||
              isLoading
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
