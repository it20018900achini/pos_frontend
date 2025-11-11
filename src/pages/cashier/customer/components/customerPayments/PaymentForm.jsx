import { useForm } from "react-hook-form";
// import {
//   Input,
// } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
export function PaymentForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      paymentMethod: "CASH",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 bg-white rounded-xl border shadow-sm"
    >
      {/* CUSTOMER ID */}
      <div className="space-y-1">
        <Label>Customer ID</Label>
        <Input
          type="number"
          {...register("customerId", { required: true, valueAsNumber: true })}
        />
        {errors.customerId && (
          <p className="text-red-500 text-sm">Customer ID is required</p>
        )}
      </div>

      {/* CASHIER ID */}
      <div className="space-y-1">
        <Label>Cashier ID</Label>
        <Input
          type="number"
          {...register("cashierId", { required: true, valueAsNumber: true })}
        />
        {errors.cashierId && (
          <p className="text-red-500 text-sm">Cashier ID is required</p>
        )}
      </div>

      {/* AMOUNT */}
      <div className="space-y-1">
        <Label>Amount</Label>
        <Input
          type="number"
          step="0.01"
          {...register("amount", {
            required: true,
            valueAsNumber: true,
            min: 0.01,
          })}
        />
        {errors.amount && (
          <p className="text-red-500 text-sm">Amount must be greater than 0</p>
        )}
      </div>

      {/* PAYMENT METHOD */}
      <div className="space-y-1">
        <Label>Payment Method</Label>
        <Select
          onValueChange={(val) => setValue("paymentMethod", val)}
          defaultValue="CASH"
          className="w-full"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CASH">Cash</SelectItem>
            <SelectItem value="CARD">Card</SelectItem>
            <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
            <SelectItem value="MOBILE_PAYMENT">Mobile Payment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* REFERENCE */}
      <div className="space-y-1">
        <Label>Reference</Label>
        <Input {...register("reference")} />
      </div>

      {/* NOTE */}
      <div className="space-y-1">
        <Label>Note</Label>
        <Textarea rows={3} {...register("note")} />
      </div>

      <Button type="submit" className="w-full">
        Submit Payment
      </Button>
    </form>
  );
}
