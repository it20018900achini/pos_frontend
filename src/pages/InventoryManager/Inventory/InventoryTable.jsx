import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";

const InventoryTable = ({ rows = [], onEdit }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Variant</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Reorder Level</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {rows.length > 0 ? (
          rows.map((row) => {
            const isLowStock = row.quantity <= row.reorderLevel;

            return (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                
                <TableCell>{row.variantName}<br/>{row.productName}</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>{row.reorderLevel}</TableCell>
                <TableCell>
                  {isLowStock ? (
                    <Badge variant="destructive">LOW</Badge>
                  ) : (
                    <Badge variant="secondary">OK</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(row)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell
              colSpan={7}
              className="text-center text-gray-500 py-6"
            >
              No inventory found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default InventoryTable;
