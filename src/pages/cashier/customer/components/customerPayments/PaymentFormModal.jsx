import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PaymentForm } from "./PaymentForm";

export function PaymentFormModal({ onSubmit }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-4 py-2 bg-primary text-white rounded-md">
          Add Payment
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Customer Payment</DialogTitle>
        </DialogHeader>

        <PaymentForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}
