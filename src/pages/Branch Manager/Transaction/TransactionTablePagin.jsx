"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTransactions,
  fetchAllTransactions,
} from "@/Redux Toolkit/features/transactions/transactionsSlice";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
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
import { ArrowDownToLine, Loader2, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

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

  const { branch } = useSelector((state) => state.branch);
  const branchId = branch?.id;
  const {
    loading,
    content,
    page,
    totalPages,
    totalElements,
    error,
    allLoading,
    allContent,
  } = useSelector((s) => s.transactions);

  // filters
  const [branchIds, setBranchIds] = useState(`${String(branchId)}`);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [pageSize, setPageSize] = useState(20);
  useEffect(() => {
    if (branchId !== undefined) {
      setBranchIds(String(branchId)); // convert number to string
    }
  }, [branchId]);
  useEffect(() => {
    handleFetch(0, pageSize);
    // setBranchIds(branchId)
    // eslint-disable-next-line
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
        branchIds,
        startDate: startIso,
        endDate: endIso,
        paymentType: paymentType || undefined,
        page: p,
        size: s,
      })
    );
  };

  const handleFetchAll = () => {
    const { startIso, endIso } = buildDates();
    dispatch(
      fetchAllTransactions({
        branchIds,
        startDate: startIso,
        endDate: endIso,
        paymentType: paymentType || undefined,
      })
    );
  };

  const downloadCsv = (rows, filename) => {
    const csv = toCsv(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const el = document.createElement("a");
    el.href = url;
    el.download = filename;
    el.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* 🔥 Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-4">


          <div>
            <Input
              value={branchIds}
              onChange={(e) => setBranchIds(e.target.value)}
              placeholder="1,2"
              className="hidden"
            />
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

          <div>
            <label className="text-sm font-medium">Payment Type</label>
            <Input
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              placeholder="CASH"
            />
          </div>

          <div className="flex items-end gap-2">
            <Button onClick={() => handleFetch(0, pageSize)}>Search</Button>
            <Button
              variant="secondary"
              disabled={allLoading}
              onClick={handleFetchAll}
            >
              {allLoading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Fetch All"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 🔥 Header Section */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Total Records: {totalElements}
        </div>

        <div className="flex gap-3">

          {/* Page size select */}
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              const size = Number(v);
              setPageSize(size);
              handleFetch(0, size);
            }}
          >
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Page size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>

          {/* CSV Download Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Download className="w-4 h-4 mr-1" /> Export
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
                onClick={() => downloadCsv(allContent, `transactions_all.csv`)}
              >
                All CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 🔥 Transactions Table */}
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
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
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
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.customerName}</TableCell>
                    <TableCell>{row.cashierName}</TableCell>
                    <TableCell>{row.amount}</TableCell>
                    <TableCell>{row.paymentMethod}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>
                      {row.createdAt
                        ? format(
                            new Date(row.createdAt),
                            "yyyy-MM-dd HH:mm:ss"
                          )
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

      {/* 🔥 Pagination */}
      <div className="flex justify-center gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={page <= 0}
          onClick={() => handleFetch(page - 1, pageSize)}
        >
          Prev
        </Button>

        <div className="px-4 py-2 text-sm">
          Page {page + 1} / {totalPages}
        </div>

        <Button
          size="sm"
          variant="outline"
          disabled={page >= totalPages - 1}
          onClick={() => handleFetch(page + 1, pageSize)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
