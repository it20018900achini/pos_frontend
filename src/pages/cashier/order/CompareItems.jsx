"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Timer } from "lucide-react";

// -------------------- SUMMARY CARD --------------------
// -------------------- SUMMARY CARD WITH PRODUCT TOTALS --------------------
// -------------------- SUMMARY CARD WITH AVAILABLE --------------------
function SummaryCard({ dataSelected }) {
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
                  <span>#{order.id} - {order?.customer?.fullName || "Walk-in Customer"}</span>
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





// -------------------- ORDER CARD --------------------
function OrderCard({ order }) {
  if (!order) return null;

  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      {/* Order Information */}
      <Card className="bg-green-600 text-green-50">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Order Information</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-end">
              <span className="font-semibold">#{order?.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Date:</span>
              <span>{format(new Date(order?.createdAt), "yyyy-MM-dd")}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Payment Method:</span>
              <span>{order?.paymentType}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Total Amount:</span>
              <span className="font-semibold">
                LKR {order?.totalAmount?.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card className="border-red-600 p-0">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Customer Information</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Name:</span>
              <span>{order?.customer?.fullName || "Walk-in Customer"}</span>
            </div>
            <div className="flex justify-between">
              <span>Phone:</span>
              <span>{order?.customer?.phone || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span>Email:</span>
              <span>{order?.customer?.email || "N/A"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Return Info */}
      <Card className="relative mt-1 bg-red-500 text-white px-2">
        #R ID {order?.id} <br />
        LKR {order?.totalAmount?.toFixed(2)} <br />
        <div className="absolute bottom-1 right-2 flex gap-1 text-sm items-center">
          <Timer className="w-3 h-3" />{" "}
          {format(new Date(order?.createdAt), "yyyy-MM-dd hh:mm a")}
        </div>
      </Card>
    </div>
  );
}

// -------------------- ORDER ITEM CARD --------------------
function OrderItemCard({ orderItem, matchedItem }) {
  const color = matchedItem
    ? matchedItem.quantity === orderItem.quantity
      ? "bg-red-500 text-white"
      : "bg-red-500 text-white"
    : "bg-red-400 text-white";

  return (
    <Card key={orderItem.id} className="shadow-md">
      <CardHeader className="flex items-center space-x-4">
        <img
          src={orderItem.product.image}
          alt={orderItem.product.name}
          className="w-16 h-16 object-cover rounded"
        />
        <div>
          <CardTitle>{orderItem.product.name}</CardTitle>
          <div>Ordered Price: LKR {orderItem.product.sellingPrice.toFixed(2)}</div>
          {matchedItem?.quantity > 0 ? (
            <div className={`px-2 mt-1 rounded ${color}`}>
              Refunded {matchedItem.quantity} from {orderItem.quantity}
            </div>
          ) : (
            <div>Quantity: {orderItem.quantity}</div>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}
export default function CompareItems({ dataSelected }) {

const data=dataSelected?.orderReturns
  const [index, setIndex] = useState(0); // 0 = Summary
  const current = index > 0 ? data[index - 1] : null;

  return (
    <div className="space-y-4">
    {/* {index}   */}
      {/* -------------------- TABS -------------------- */}
      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar py-2">
        {/* Summary Tab */}
        <button
          onClick={() => setIndex(0)}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
            index === 0
              ? "bg-purple-600 text-white border-purple-600 shadow-sm"
              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
          }`}
        >
          Summary
        </button>

        {/* Record Tabs */}
        {data.map((item, i) => (
          <button
            key={i}
            onClick={() => setIndex(i + 1)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
              index === i + 1
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
          >
            #{item.id}
          </button>
        ))}
      </div>

      {/* -------------------- SUMMARY VIEW -------------------- */}
      {index === 0 && <SummaryCard dataSelected={dataSelected} />}

      {/* -------------------- RECORD VIEW -------------------- */}
      {index !== 0 && current && (
        <>
          <OrderCard order={current} />

          {current?.order?.items?.map((orderItem) => {
            const matchedItem = current?.items?.find(
              (item) => item.productId === orderItem.productId
            );
            return (
              <OrderItemCard
                key={orderItem.id}
                orderItem={orderItem}
                matchedItem={matchedItem}
              />
            );
          })}
        </>
      )}
    </div>
  );
}

