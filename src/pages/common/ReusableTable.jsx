"use client";

import React, { useState, useMemo } from "react";
import {
  Table as ShadTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, ChevronDown, ChevronUp } from "lucide-react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ReusableTable = ({
  columns = [],
  data = [],
  loading = false,
  actions = null,

  // SERVER MODE
  isServer = false,
  page = 0,
  totalPages = 1,
  onPageChange = () => {},
  onSearchChange = () => {},
  sort = null,
  onSortChange = () => {},

  // CLIENT MODE
  isClient = false,
  pageSize = 10,
  searchFields = null,

  fetchAllData = null,
  exportTypes = ["csv", "excel", "pdf"],
}) => {
  const [search, setSearch] = useState("");

  /** SORT */
  const handleSort = (col) => {
    if (!col.sortable) return;
    if (isServer) {
      let direction = "asc";
      if (sort?.field === col.accessor) direction = sort.direction === "asc" ? "desc" : "asc";
      onSortChange({ field: col.accessor, direction });
    }
  };

  /** CLIENT FILTER */
  const filteredData = useMemo(() => {
    if (isServer) return data;
    let temp = data;
    if (search && searchFields) {
      temp = temp.filter((row) =>
        searchFields.some((field) =>
          String(row[field]).toLowerCase().includes(search.toLowerCase())
        )
      );
    }
    return temp;
  }, [data, search, searchFields, isServer]);

  /** EXPORT */
  const exportData = async (type) => {
    let exportRows = filteredData;
    if (fetchAllData) exportRows = await fetchAllData();

    const headers = columns.map((c) => c.header);
    const rows = exportRows.map((r) => columns.map((c) => r[c.accessor]));

    if (type === "csv") {
      const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
      saveAs(new Blob([csv]), "data.csv");
    }

    if (type === "excel") {
      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet");
      XLSX.writeFile(wb, "data.xlsx");
    }

    if (type === "pdf") {
      const doc = new jsPDF();
      doc.autoTable({ head: [headers], body: rows });
      doc.save("data.pdf");
    }
  };

  /** STATUS BADGES WITH LIGHT/DARK */
  const renderStatusBadge = (value) => {
    let base = "px-2 py-1 rounded-full text-sm font-semibold ";

    switch (value) {
      case "REFUNDED":
        base += "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
        break;
      case "PAID":
      case "COMPLETED":
        base += "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
        break;
      case "PENDING":
        base += "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
        break;
      default:
        base += "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }

    return <span className={base}>{value}</span>;
  };

  /** ROW BACKGROUND BASED ON STATUS & DARK MODE */
  const rowClassByStatus = (status) => {
    switch (status) {
      case "REFUNDED":
        return "bg-red-50 hover:bg-red-100 dark:bg-red-900 dark:hover:bg-red-800";
      case "PAID":
      case "COMPLETED":
        return "bg-green-50 hover:bg-green-100 dark:bg-green-900 dark:hover:bg-green-800";
      case "PENDING":
        return "bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900 dark:hover:bg-yellow-800";
      default:
        return "bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700";
    }
  };

  return (
    <div className="space-y-4">

      {/* Search + Export */}
      <div className="flex justify-between">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (isServer) onSearchChange(e.target.value);
          }}
          className="max-w-xs"
        />
        <div className="flex gap-2">
          {exportTypes.includes("csv") && <Button size="sm" onClick={() => exportData("csv")}>CSV</Button>}
          {exportTypes.includes("excel") && <Button size="sm" onClick={() => exportData("excel")}>Excel</Button>}
          {exportTypes.includes("pdf") && <Button size="sm" onClick={() => exportData("pdf")}>PDF</Button>}
        </div>
      </div>

      {/* TABLE */}
      <ShadTable className="overflow-x-auto rounded-lg shadow-md bg-white dark:bg-gray-900">
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.accessor}
                onClick={() => handleSort(col)}
                className={col.sortable ? "cursor-pointer" : ""}
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && (
                    <>
                      <ChevronUp
                        className={`w-3 h-3 ${
                          isServer && sort?.field === col.accessor && sort?.direction === "asc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-400 dark:text-gray-300"
                        }`}
                      />
                      <ChevronDown
                        className={`w-3 h-3 ${
                          isServer && sort?.field === col.accessor && sort?.direction === "desc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-400 dark:text-gray-300"
                        }`}
                      />
                    </>
                  )}
                </div>
              </TableHead>
            ))}
            {actions && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : filteredData.length ? (
            filteredData.map((row, i) => (
              <TableRow key={i} className={`transition-all ${rowClassByStatus(row.status)}`}>
                {columns.map((col) => (
                  <TableCell key={col.accessor}>
                    {col.type === "status" ? renderStatusBadge(row[col.accessor]) : row[col.accessor]}
                  </TableCell>
                ))}
                {actions && <TableCell>{actions(row)}</TableCell>}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="text-center">
                No data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </ShadTable>

      {/* PAGINATION */}
      <div className="flex justify-end gap-2">
        <Button disabled={page === 0} onClick={() => onPageChange(page - 1)}>Prev</Button>
        <span>Page {page + 1} / {totalPages}</span>
        <Button disabled={page + 1 >= totalPages} onClick={() => onPageChange(page + 1)}>Next</Button>
      </div>
    </div>
  );
};

export default ReusableTable;