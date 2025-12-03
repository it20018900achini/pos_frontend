import { format } from "date-fns";

/**
 * Generates a flattened summary array from order returns,
 * including a final summary row with overall totals.
 * @param {Object} dataSelected - The selected data containing order returns and items
 * @returns {Array} - Flattened array of summary objects with a summary row
 */
export function getFlattenedRefundSummaryWithTotals(dataSelected) {
  const data = dataSelected?.orderReturns || [];
  const originalItems = dataSelected?.items || [];

  const productTotals = {};

  // Precompute product totals
  data.forEach((order) => {
    order.items?.forEach((item) => {
      const key = item.productId;
      const originalItem = originalItems.find((p) => p.productId === key);

      if (!productTotals[key]) {
        productTotals[key] = {
          productId: key,
          name: item.product.name,
          totalQty: 0,
          totalAmount: 0,
          price: item.product.sellingPrice,
          available: originalItem ? originalItem.quantity : item.product.available || 0,
        };
      }

      productTotals[key].totalQty += item.quantity || 0;
      productTotals[key].totalAmount += (item.quantity || 0) * item.product.sellingPrice;
      productTotals[key].available -= item.quantity || 0;
    });
  });

  // Build flattened array
  const flattened = [];

  data.forEach((order) => {
    order.items?.forEach((item) => {
      const key = item.productId;
      flattened.push({
        orderId: order.id,
        orderDate: format(order?.createdAt, "yyyy-MM-dd h:mm a"),
        customerPhone: order?.customer?.phone || null,
        productId: key,
        productName: item.product.name,
        quantity: item.quantity || 0,
        sellingPrice: item.product.sellingPrice,
        totalPrice: (item.quantity || 0) * item.product.sellingPrice,
        totalQtyPerProduct: productTotals[key].totalQty,
        totalAmountPerProduct: productTotals[key].totalAmount,
        availableStock: productTotals[key].available,
        orderTotalAmount: order.totalAmount || 0,
      });
    });
  });

  // Compute overall totals
  const overallTotals = {
    orderId: "TOTAL",
    orderDate: "",
    customerPhone: "",
    productId: "",
    productName: "All Products",
    quantity: flattened.reduce((sum, row) => sum + row.quantity, 0),
    sellingPrice: 0,
    totalPrice: flattened.reduce((sum, row) => sum + row.totalPrice, 0),
    totalQtyPerProduct: flattened.reduce((sum, row) => sum + row.totalQtyPerProduct, 0),
    totalAmountPerProduct: flattened.reduce((sum, row) => sum + row.totalAmountPerProduct, 0),
    availableStock: flattened.reduce((sum, row) => sum + row.availableStock, 0),
    orderTotalAmount: flattened.reduce((sum, row) => sum + row.orderTotalAmount, 0),
  };

  // Append summary row
  flattened.push(overallTotals);

  return flattened;
}
