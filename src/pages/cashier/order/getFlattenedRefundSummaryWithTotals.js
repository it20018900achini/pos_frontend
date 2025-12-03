import { format } from "date-fns";

export function getFlattenedRefundSummaryWithTotals(dataSelected) {
  const data = dataSelected?.orderReturns || [];
  const originalItems = dataSelected?.items || [];

  const productTotals = {};

  // --- Precompute totals per product ---
  data.forEach((order) => {
    order.items?.forEach((item) => {
      const key = item.productId;
      const originalItem = originalItems.find((p) => p.productId === key);

      if (!productTotals[key]) {
        productTotals[key] = {
          productId: key,
          productName: item.product.name,
          price: item.product.sellingPrice,
          totalQty: 0,
          totalAmount: 0,
          availableStock: originalItem
            ? originalItem.quantity
            : item.product.available || 0,
        };
      }

      productTotals[key].totalQty += item.quantity || 0;
      productTotals[key].totalAmount += (item.quantity || 0) * item.product.sellingPrice;
      productTotals[key].availableStock -= item.quantity || 0;
    });
  });

  // --- Flatten all rows ---
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
        orderTotalAmount: order.totalAmount || 0,
      });
    });
  });

  // --- Convert productTotals object to array ---
  const products = Object.values(productTotals);

  // --- Overall totals ---
  const totals = {
    totalOrders: data.length,
    totalQuantity: flattened.reduce((s, r) => s + r.quantity, 0),
    totalPrice: flattened.reduce((s, r) => s + r.totalPrice, 0),
    totalOrderAmount: flattened.reduce((s, r) => s + r.orderTotalAmount, 0),
    totalProductsReturned: flattened.length,
    totalUniqueProducts: products.length,
    totalCustomers: new Set(flattened.map((x) => x.customerPhone)).size,
  };

  return {
    flattened,
    products,
    totals,
  };
}
