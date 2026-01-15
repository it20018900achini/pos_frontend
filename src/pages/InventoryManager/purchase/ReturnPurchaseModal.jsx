import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { returnPurchaseThunk } from "@/Redux Toolkit/features/purchase/purchaseSlice";

const ReturnPurchaseModal = ({ open, onClose, purchase }) => {
  const dispatch = useDispatch();
  const [items, setItems] = useState([]);

  const handleQtyChange = (variantId, qty) => {
    setItems((prev) => {
      const exists = prev.find(i => i.productVariantId === variantId);
      if (exists) {
        return prev.map(i =>
          i.productVariantId === variantId
            ? { ...i, quantity: Number(qty) }
            : i
        );
      }
      return [...prev, { productVariantId: variantId, quantity: Number(qty) }];
    });
  };

  const handleSubmit = () => {
    dispatch(
      returnPurchaseThunk({
        purchaseId: purchase.id,
        items: items.filter(i => i.quantity > 0),
      })
    );
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Return Purchase #{purchase?.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {purchase?.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-2"
            >
              <div>
                <p className="font-medium">{item.variantName}</p>
                <p className="text-sm text-muted-foreground">
                  Purchased: {item.quantity}
                </p>
              </div>

              <Input
                type="number"
                min={0}
                max={item.quantity}
                placeholder="Return qty"
                className="w-28"
                onChange={(e) =>
                  handleQtyChange(item.productVariantId, e.target.value)
                }
              />
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Confirm Return
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnPurchaseModal;
