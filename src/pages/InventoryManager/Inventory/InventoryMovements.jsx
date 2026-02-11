import React, { useState } from "react";
import { useGetInventoryMovementsQuery } from "../../../Redux Toolkit/features/inventory/inventoryApi";
import { useSelector } from "react-redux";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import ContentLayout from "../../Dashboard/ContentLayout";

const InventoryMovements = () => {
  const { userProfile } = useSelector((state) => state.user);
  const [page, setPage] = useState(0);

  const { data, isLoading, isError } = useGetInventoryMovementsQuery({
    branchId: userProfile?.user?.branch?.id || 52,
    page,
    size: 20,
  });

  if (isLoading) return <p>Loading inventory movements...</p>;
  if (isError) return <p>Something went wrong!</p>;

  const { content, totalPages } = data;

  return (
    <ContentLayout title="Inventory Movements" subTitle="Track all inventory changes in your branch.">
    <div className="space-y-4 overflow-x-auto p-4">

      <Table className="min-w-[600px] md:min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="hidden sm:table-cell">ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Variant</TableHead>
            <TableHead className="hidden md:table-cell">Reference</TableHead>
            <TableHead className="hidden lg:table-cell">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {content.map((movement) => (
            <TableRow key={movement.id}>
              <TableCell className="hidden sm:table-cell">{movement.id}</TableCell>
              <TableCell>{movement.type}</TableCell>
              <TableCell>{movement.quantityChange}</TableCell>
              <TableCell>{movement.product?.name}</TableCell>
              <TableCell className="flex items-center space-x-2">
                {movement.variant?.imageUrl && (
                  <img
                    src={movement.variant.imageUrl}
                    alt={movement.variant.name}
                    className="w-8 h-8 rounded object-cover"
                  />
                )}
                <span>{movement.variant?.name}</span>
              </TableCell>
              <TableCell className="hidden md:table-cell">{movement.reference}</TableCell>
              <TableCell className="hidden lg:table-cell">
                {new Date(movement.createdAt).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex flex-wrap gap-2 justify-end mt-2">
        <Button
          disabled={page === 0}
          onClick={() => setPage((prev) => prev - 1)}
          variant="outline"
        >
          Previous
        </Button>
        <Button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
    </ContentLayout>
  );
};

export default InventoryMovements;
