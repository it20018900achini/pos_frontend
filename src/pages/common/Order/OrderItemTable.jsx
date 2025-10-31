import { Fragment, useRef } from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

const OrderItemTable = ({ selectedOrder }) => {
  // Store return values per item
  const returnQuantityRef = useRef({});
  const returnReasonRef = useRef({});

  // Handle RETURN submit per item
  const handleSubmit = async (event, item) => {
    event.preventDefault();

    const quantity = returnQuantityRef.current[item.id] || 0;
    const reason = returnReasonRef.current[item.id] || "";

    const payload = {
      returned: true,
      returnReason: reason,
      returnQuantity: Number(quantity),
    };

    try {
      const response = await fetch(
        `http://localhost:5000/order-items/${item.id}/return`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.text();
      console.log("Return successful:", data);
      alert(`Return submitted successfully for Item ID: ${item.id}`);
      
      // ✅ Optionally clear input fields after submit
      returnQuantityRef.current[item.id] = "";
      returnReasonRef.current[item.id] = "";

    } catch (error) {
      console.error("Error submitting return:", error);
      // alert(`Error submitting return for Item ID: ${item.id}`);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Image</TableHead>
            <TableHead>Item</TableHead>
            <TableHead className="text-center">Quantity</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {selectedOrder.items?.map((item) => (
            <Fragment key={item?.id}>
              {/* Main Row */}
              <TableRow
                className={item.returned ? "bg-red-200 hover:bg-red-300" : ""}
              >
                <TableCell>
                  <div className="w-10 h-10">
                    {item.product?.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product?.name || "Product"}
                        className="w-10 h-10 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-md border flex items-center justify-center">
                        <span className="text-xs text-gray-500 font-medium">
                          {(item.productName || item.product?.name || "P")
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {(item.product?.name || "Product").slice(0, 20)}...
                    </span>
                    {item.product?.sku && (
                      <span className="text-xs text-gray-500">
                        SKU: {item.product.sku.slice(0, 17)}...
                      </span>
                    )}
                  </div>
                </TableCell>

                <TableCell className="text-center">{item.quantity}</TableCell>

                <TableCell className="text-right">
                  LKR {item.product?.sellingPrice?.toFixed(2) || "0.00"}
                </TableCell>

                <TableCell className="text-right">
                  LKR{" "}
                  {(item.product?.sellingPrice * item.quantity)?.toFixed(2) ||
                    "0.00"}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={5} className="p-0">
                  <div className="w-full bg-red-200 border-b border-neutral-800 p-1 flex justify-between items-center">
                    <div className="w-full">
                      {item.returned && (
                        <Badge className="bg-red-500 text-[8px] py-0 px-1">
                          RETURNED
                        </Badge>
                      )}
                    </div>
                    {/* <pre></pre>
{JSON.stringify(item,null,2)} */}

                    <div className="flex items-center gap-2">
                      {item.id}

                      {/* RETURN FORM */}
                      <form onSubmit={(e) => handleSubmit(e, item)}>
                        <div className="flex gap-2 items-center">
                          {/* Quantity Input */}
                          <input
                            className="border border-neutral-800 w-15"
                            type="number"
                            min={1}
                            max={item.quantity}
                            placeholder="Qty"
                            onChange={(e) =>
                              (returnQuantityRef.current[item.id] = e.target.value)
                            }
                          />

                          {/* Reason Input */}
                          <input
                            className="border border-neutral-800 w-40"
                            type="text"
                            placeholder="Reason"
                            onChange={(e) =>
                              (returnReasonRef.current[item.id] = e.target.value)
                            }
                          />

                          <Button
                            className="px-2 rounded-0"
                            size="xs"
                            type="submit"
                          >
                            RETURN
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </Fragment >
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default OrderItemTable;
