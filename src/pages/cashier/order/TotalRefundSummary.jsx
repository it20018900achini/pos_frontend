import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

export const TotalRefundSummary=({ dataSelected })=> {
  const data = dataSelected?.orderReturns || [];
  const originalItems = dataSelected?.items || [];

  const totalAmount = data.reduce((sum, d) => sum + (d.totalAmount || 0), 0);
  const totalCustomers = new Set(data.map((x) => x?.customer?.phone)).size;
  const totalProducts = data.flatMap((d) => d.items || []).length;

  // Calculate total quantity, total amount, and available per product
  const productTotals = {};

  data.forEach((order) => {
    order.items?.forEach((item) => {
      const key = item.productId;

      // Find original stock from dataSelected?.items
      const originalItem = originalItems.find((p) => p.productId === key);

      if (!productTotals[key]) {
        productTotals[key] = {
          name: item.product.name,
          qty: 0,
          total: 0,
          price: item.product.sellingPrice,
          available: originalItem ? originalItem.quantity : item.product.available || 0, // original stock
        };
      }

      productTotals[key].qty += item.quantity || 0;
      productTotals[key].total += (item.quantity || 0) * item.product.sellingPrice;

      // Reduce available stock by returned qty
      productTotals[key].available -= item.quantity || 0;
    });
  });

  return (
    <Card className="p-4 border-purple-600 space-y-4">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Summary Overview</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        {/* Totals */}
        <div className="flex justify-between">
          <span className="font-semibold">Total Records:</span>
          <span>{data.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Total Returned Amount:</span>
          <span>LKR {totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Total Customers:</span>
          <span>{totalCustomers}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Total Products Returned:</span>
          <span>{totalProducts}</span>
        </div>

        {/* Orders */}
        <div className="mt-4">
          <h3 className="font-semibold text-lg mb-2">Orders</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {data.map((order) => (
              <div
                key={order.id}
                className="p-3 border rounded hover:bg-gray-100 transition space-y-2"
              >
                <div className="flex justify-between font-medium">
                  <span>#{order.id} | {format(order?.createdAt,'yyyy-MM-dd h:mm a') }</span>
                  <span>LKR {order.totalAmount?.toFixed(2)}</span>
                </div>

                <div className="ml-4 space-y-1 text-sm">
                  {order.items?.map((item) => {
                    const qty = item.quantity || 0;
                    const totalPrice = qty * item.product.sellingPrice;
                    return (
                      <div key={item.productId} className="flex justify-between">
                        <span>{item.product.name}</span>
                        <span>
                          Qty: {qty} × {item.product.sellingPrice.toFixed(2)} = {totalPrice.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total per product across all orders */}
        <div className="mt-4">
          <h3 className="font-semibold text-lg mb-2">Total per Product</h3>
          <div className="space-y-1 text-sm">
            {Object.values(productTotals).map((p, idx) => (
              <div key={idx} className="flex justify-between border-b py-1">
                <span>{p.name}</span>
                <span>
                  Qty: {p.qty} × {p.price.toFixed(2)} = {p.total.toFixed(2)}
                  {p.available !== undefined ? ` (Available: ${p.available})` : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}