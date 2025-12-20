import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPurchases } from "@/Redux Toolkit/features/purchase/purchaseSlice";
import PurchaseModal from "./PurchaseModal";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PurchaseList = () => {
  const dispatch = useDispatch();
  const { purchases, loading } = useSelector((state) => state.purchase);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(getPurchases({ page: 0, size: 10 }));
  }, [dispatch]);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle>Purchases</CardTitle>
          <Button onClick={() => setOpen(true)}>+ New Purchase</Button>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full border rounded-md">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Supplier</th>
                  <th className="p-2 text-left">Total</th>
                  <th className="p-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-2">{p.id}</td>
                    <td className="p-2">{p.supplier?.name}</td>
                    <td className="p-2">Rs. {p.totalAmount}</td>
                    <td className="p-2">
                      {new Date(p.purchaseDate).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <PurchaseModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default PurchaseList;
