import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const InventoryTableSkeleton = () => {
  return (
    <div className="animate-in fade-in duration-300">
      <Table>
        {/* Table Header */}
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {[...Array(8)].map((_, index) => (
            <TableRow key={index} className="border-b">
              <TableCell>
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              </TableCell>

              <TableCell>
                <div className="h-4 w-40 bg-muted rounded animate-pulse" />
              </TableCell>

              <TableCell>
                <div className="h-4 w-28 bg-muted rounded animate-pulse" />
              </TableCell>

              <TableCell>
                <div className="h-4 w-10 bg-muted rounded animate-pulse" />
              </TableCell>

              <TableCell className="text-right">
                <div className="h-4 w-24 bg-muted rounded animate-pulse ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryTableSkeleton;
