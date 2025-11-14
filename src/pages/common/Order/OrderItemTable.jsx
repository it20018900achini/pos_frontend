import { Fragment, useRef, useState } from "react";
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
// import { useNavigate } from "react-router";
// import api from "@/utils/api";
import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";
import { settings } from "../../../constant";
const OrderItemTable = ({ selectedOrder }) => {
  const [updatedItems, setUpdatedItems] = useState({ items: [] });
  const [showReturnForm, setShowReturnForm] = useState(null);
  const [loadReturning, setLoadReturning] = useState(false);
  // const navigate = useNavigate();
  // Store return values per item
  const returnQuantityRef = useRef({});
  const returnReasonRef = useRef({});

  const getAuthToken = () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      throw new Error("No JWT token found");
    }
    return token;
  };
  // Helper function to set auth headers
  const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };
  // Handle RETURN submit per item
  const handleSubmit = async (event, item) => {
    event.preventDefault();
    setLoadReturning(true);
    const quantity = returnQuantityRef.current[item.id] || 0;
    const reason = returnReasonRef.current[item.id] || "";

    const payload = {
      returned: true,
      returnReason: reason,
      returnQuantity: Number(quantity),
    };
    alert(JSON.stringify(payload));

    try {
      const response = await fetch(
        settings?.url+`/order-items/${item.id}/return`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
     

      try {
        const headers = getAuthHeaders();
        const response1 = await fetch(
          settings?.url+`/api/orders/${selectedOrder.id}`,
          { headers }
        );
        if (!response1.ok) {
          throw new Error(`HTTP error! status: ${response1.status}`);
        }
        const result = await response1.json();
        setUpdatedItems(result);
        setLoadReturning(false);
        console.log("Fetched updated order items:", result);
      } catch (error) {
        // setError(error);
        console.log(error)
      } finally {
        // setLoading(false);
      }

      //  const responseOr =await fetch(`/api/orders/${selectedOrder.id}`,null, {
      //         headers: { Authorization: `Bearer ${tk}` },
      //       });

      //       console.log("Return fetch order response:", responseOr);
      //       if (!responseOr.ok) {
      //         throw new Error("Failed to fetch updated order");
      //       }

      //       setUpdatedItems(responseOr?.items);

      // const data = await response.text();
      // console.log("Return successful:", data);
      // navigate(0);

      toast.success(`Return submitted successfully `);

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
          {(updatedItems?.items?.length > 0
            // eslint-disable-next-line no-unsafe-optional-chaining
            ? updatedItems?.items
            : selectedOrder.items
          ).map((item) => (
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

            </Fragment>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default OrderItemTable;
