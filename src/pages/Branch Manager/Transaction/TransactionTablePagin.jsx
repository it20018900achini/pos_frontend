"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTransactions,
  fetchAllTransactions,
} from "@/Redux Toolkit/features/transactions/transactionsSlice";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { format } from "date-fns";
import { Loader2, Download } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import ContentLayout from "../../Dashboard/ContentLayout";

function toCsv(rows) {
  if (!rows || rows.length === 0) return "";

  const headers = Object.keys(rows[0]);

  return [
    headers.join(","),
    ...rows.map((r) =>
      headers
        .map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`)
        .join(",")
    ),
  ].join("\n");
}

export default function TransactionTablePagin() {
  const dispatch = useDispatch();

  const {
    loading,
    content,
    page,
    totalPages,
    totalElements,
    allContent,
  } = useSelector((s) => s.transactions);

  const { selectedBranchId } = useSelector((state) => state.user);
  const branchId = selectedBranchId;

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    if (branchId) {
      handleFetch(0, pageSize);
    }
  }, [branchId]);

  const buildDates = () => {
    const startIso = startDate ? `${startDate}T00:00:00` : null;
    const endIso = endDate ? `${endDate}T23:59:59` : null;

    return { startIso, endIso };
  };

  const handleFetch = (p = 0, s = pageSize) => {
    const { startIso, endIso } = buildDates();

    dispatch(
      fetchTransactions({
        branchId,
        start: startIso,
        end: endIso,
        page: p,
        size: s,
      })
    );
  };

  const handleFetchAll = () => {
    const { startIso, endIso } = buildDates();

    dispatch(
      fetchAllTransactions({
        branchId,
        start: startIso,
        end: endIso,
      })
    );
  };

  const downloadCsv = (rows, filename) => {
    const csv = toCsv(rows);

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const el = document.createElement("a");
    el.href = url;
    el.download = filename;
    el.click();

    URL.revokeObjectURL(url);
  };

  return (
    <ContentLayout
      title="Transactions"
  subTitle="View and manage all sales and purchase transactions"
    >
    <div className="max-w-7xl mx-auto p-6 space-y-6">

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <div>
            <label className="text-sm font-medium">Start Date</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">End Date</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="flex items-end gap-2">
            <Button onClick={() => handleFetch(0, pageSize)}>
              Search
            </Button>

            <Button
              variant="secondary"
              onClick={handleFetchAll}
            >
              Fetch All
            </Button>
          </div>

        </CardContent>
      </Card>

      {/* Header */}
      <div className="flex justify-between items-center">

        <div className="text-sm text-muted-foreground">
          Total Records: {totalElements}
        </div>

        <div className="flex gap-3">

          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              const size = Number(v);
              setPageSize(size);
              handleFetch(0, size);
            }}
          >
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>

              <DropdownMenuItem
                onClick={() =>
                  downloadCsv(content, `transactions_page_${page}.csv`)
                }
              >
                Page CSV
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  downloadCsv(allContent, `transactions_all.csv`)
                }
              >
                All CSV
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">

          <Table>

            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Cashier</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>

              {loading ? (
                <TableRow>
                  <TableCell colSpan="8" className="text-center p-6">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : content?.length > 0 ? (
                content.map((row) => (

                  <TableRow key={`${row.type}-${row.id}`}>

                    <TableCell>{row.type}</TableCell>

                    <TableCell>{row.referenceId}</TableCell>

                    <TableCell>{row.customer}</TableCell>

                    <TableCell>{row.cashier}</TableCell>

                    <TableCell
                      className={`font-medium ${
                        row.type === "ORDER"
                          ? "text-indigo-600"
                          : "text-blue-600"
                      }`}
                    >
                      + LKR {(row.amount ?? 0).toFixed(2)}
                    </TableCell>

                    <TableCell>{row.paymentMethod}</TableCell>

                    <TableCell>{row.reference}</TableCell>

                    <TableCell>
                      {row.paidAt
                        ? format(new Date(row.paidAt), "yyyy-MM-dd HH:mm:ss")
                        : ""}
                    </TableCell>

                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="8" className="text-center py-6">
                    No Results
                  </TableCell>
                </TableRow>
              )}

            </TableBody>

          </Table>

        </CardContent>
      </Card>

      {/* Pagination */}
     <div className="flex items-center justify-center gap-3 mt-4">

  <Button
    size="sm"
    variant="outline"
    disabled={page === 0 || totalPages === 0}
    onClick={() => handleFetch(page - 1, pageSize)}
  >
    Prev
  </Button>

  <span className="text-sm font-medium">
    Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
  </span>

  <Button
    size="sm"
    variant="outline"
    disabled={page >= totalPages - 1 || totalPages === 0}
    onClick={() => handleFetch(page + 1, pageSize)}
  >
    Next
  </Button>

</div>
    </div>
    </ContentLayout>
  );
}