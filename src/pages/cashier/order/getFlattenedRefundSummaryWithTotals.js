import { format } from "date-fns";

export function getFlattenedRefundSummaryWithTotals(dataSelected) {
  const data = dataSelected?.orderReturns || [];
  const originalItems = dataSelected?.items || [];

  const productTotals = {};

  // --- Step 1: Initialize productTotals with ALL original items ---
  originalItems.forEach((item) => {
    productTotals[item.productId] = {
      productId: item.productId,
      productName: item.product?.name || item.name,
      price: item.product?.sellingPrice || item.sellingPrice,
      totalQty: 0,                 // returned qty
      totalAmount: 0,
      availableStock: item.quantity, // original quantity
    };
  });

  // --- Step 2: Deduct returned items ---
  data.forEach((order) => {
    order.items?.forEach((item) => {
      const key = item.productId;
      const sellingPrice = item.product.sellingPrice;

      if (!productTotals[key]) {
        // In case a returned item does NOT exist in originalItems
        productTotals[key] = {
          productId: key,
          productName: item.product.name,
          price: sellingPrice,
          totalQty: 0,
          totalAmount: 0,
          availableStock: item.product.available || 0,
        };
      }

      productTotals[key].totalQty += item.quantity || 0;
      productTotals[key].totalAmount += (item.quantity || 0) * sellingPrice;
      productTotals[key].availableStock -= item.quantity || 0;
    });
  });

  // --- Step 3: Flatten rows ---
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

  // --- Step 4: Convert to array ---
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
      totalAvailableQuantity: products.reduce((s, p) => s + p.availableStock, 0),


  };

  return {
    flattened,
    products,
    totals,
    order: dataSelected?.items
  };
}
