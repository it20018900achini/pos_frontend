import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export function PaymentMethodSelect({ value, onChange }) {
  return (
    <Select defaultValue={value} onValueChange={onChange}>
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
  );
}
