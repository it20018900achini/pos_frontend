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
import { FileText, FileSpreadsheet, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ReusableTable = ({
  columns = [], // { header, accessor, total?, sortable? }
  data = [],
  loading = false,
  actions = null,
  isClient = false,
  pageSize = 10,
  searchFields = null,
  fetchAllData = null,
  isNumbering = true,
  view = "table", // "table" | "card" | "list"
  exportTypes = ["csv", "excel", "pdf"], // new prop
}) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  /** SORT HANDLER */
  const handleSort = (col) => {
    if (!col.sortable) return;
    if (sortColumn === col.accessor) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(col.accessor);
      setSortDirection("asc");
    }
  };

  /** FILTER & SORT DATA */
  const filteredData = useMemo(() => {
    let temp = data;
    if (search && searchFields) {
      temp = temp.filter((row) =>
        searchFields.some((field) =>
          String(row[field]).toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    if (sortColumn) {
      temp = [...temp].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
        }

        return sortDirection === "asc"
          ? String(aVal || "").localeCompare(String(bVal || ""))
          : String(bVal || "").localeCompare(String(aVal || ""));
      });
    }
    return temp;
  }, [data, search, searchFields, sortColumn, sortDirection]);

  /** PAGINATION */
  const paginatedData = useMemo(() => {
    if (!isClient) return filteredData;
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize, isClient]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  /** TOTALS FOR NUMERIC COLUMNS */
  const totals = useMemo(() => {
    const t = {};
    columns.forEach((col) => {
      if (col.total) {
        t[col.accessor] = filteredData.reduce(
          (sum, row) => sum + (Number(row[col.accessor]) || 0),
          0
        );
      }
    });
    return t;
  }, [filteredData, columns]);

  /** EXPORT DATA */
  const exportData = async (format) => {
    if (!exportTypes.includes(format)) return;
    let exportRows = filteredData;
    if (fetchAllData) exportRows = await fetchAllData();
    const headers = ["#", ...columns.map((c) => c.header)];
    const rows = exportRows.map((row, idx) => [
      idx + 1,
      ...columns.map((c) => row[c.accessor]),
    ]);

    if (format === "csv") {
      const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
      saveAs(new Blob([csvContent], { type: "text/csv;charset=utf-8;" }), "export.csv");
    } else if (format === "excel") {
      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, "export.xlsx");
    } else if (format === "pdf") {
      const doc = new jsPDF();
      doc.autoTable({ head: [headers], body: rows });
      doc.save("export.pdf");
    }
  };

  /** RENDER EXPORT BUTTONS */
  const renderExportButtons = () => (
    <div className="flex gap-2">
      {exportTypes.includes("csv") && (
        <Button size="sm" onClick={() => exportData("csv")} variant="outline">
          <FileText className="w-4 h-4 mr-1" /> CSV
        </Button>
      )}
      {exportTypes.includes("excel") && (
        <Button size="sm" onClick={() => exportData("excel")} variant="outline">
          <FileSpreadsheet className="w-4 h-4 mr-1" /> Excel
        </Button>
      )}
      {exportTypes.includes("pdf") && (
        <Button size="sm" onClick={() => exportData("pdf")} variant="outline">
          PDF
        </Button>
      )}
    </div>
  );

  /** RENDER TABLE */
  const renderTable = () => (
    <ShadTable>
      <TableHeader>
        <TableRow>
          {isNumbering && <TableHead>#</TableHead>}
          {columns.map((col) => (
            <TableHead
              key={col.accessor}
              className={col.sortable ? "cursor-pointer select-none" : ""}
              onClick={() => col.sortable && handleSort(col)}
            >
              <div className="flex items-center gap-1">
                {col.header}
                {col.sortable && (
                  <span className="flex flex-col ml-1">
                    <ChevronUp
                      className={`w-3 h-3 ${
                        sortColumn === col.accessor && sortDirection === "asc"
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    />
                    <ChevronDown
                      className={`w-3 h-3 -mt-1 ${
                        sortColumn === col.accessor && sortDirection === "desc"
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    />
                  </span>
                )}
              </div>
            </TableHead>
          ))}
          {actions && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedData.length > 0 ? (
          paginatedData.map((row, idx) => (
            <TableRow key={idx}>
              {isNumbering && <TableCell>{isClient ? (page - 1) * pageSize + idx + 1 : idx + 1}</TableCell>}
              {columns.map((col) => <TableCell key={col.accessor}>{row[col.accessor]}</TableCell>)}
              {actions && <TableCell>{actions(row)}</TableCell>}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length + (actions ? 2 : 1) + (isNumbering ? 1 : 0)} className="text-center">
              {loading ? "Loading..." : "No data found"}
            </TableCell>
          </TableRow>
        )}
        {Object.keys(totals).length > 0 && (
          <TableRow className="font-bold bg-gray-100">
            <TableCell>Total</TableCell>
            {columns.map((col) => <TableCell key={col.accessor}>{col.total ? totals[col.accessor] : ""}</TableCell>)}
            {actions && <TableCell />}
          </TableRow>
        )}
      </TableBody>
    </ShadTable>
  );

  /** RENDER CARD */
  const renderCard = () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {paginatedData.length > 0 ? paginatedData.map((row, idx) => (
        <div key={idx} className="border rounded-lg p-4 shadow-sm bg-white">
          {isNumbering && <div className="font-bold mb-2">#{(page - 1) * pageSize + idx + 1}</div>}
          {columns.map((col) => (
            <div key={col.accessor} className="flex justify-between">
              <span className="font-semibold">{col.header}:</span>
              <span>{row[col.accessor]}</span>
            </div>
          ))}
          {actions && <div className="mt-2">{actions(row)}</div>}
        </div>
      )) : <div>No data found</div>}
    </div>
  );

  /** RENDER LIST */
  const renderList = () => (
    <ul className="space-y-2">
      {paginatedData.length > 0 ? paginatedData.map((row, idx) => (
        <li key={idx} className="border p-2 rounded flex justify-between bg-white shadow-sm">
          {isNumbering && <span className="mr-2 font-bold">#{(page - 1) * pageSize + idx + 1}</span>}
          {columns.map((col) => (
            <span key={col.accessor} className="mr-4">
              <span className="font-semibold">{col.header}:</span> {row[col.accessor]}
            </span>
          ))}
          {actions && <span>{actions(row)}</span>}
        </li>
      )) : <li>No data found</li>}
    </ul>
  );

  /** RENDER PAGINATION */
  const renderPagination = () => (
    <div className="flex justify-end items-center gap-2 mt-2">
      <Button size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
      <span className="px-2">Page {page} of {totalPages || 1}</span>
      <Button size="sm" disabled={page === totalPages || totalPages === 0} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Search & Export */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
        {searchFields && (
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
        )}
        <div>{exportTypes.length > 0 && renderExportButtons()}</div>
      </div>

      {/* Total Records */}
      <div className="flex gap-2 w-full justify-between">

      <div className="text-sm text-gray-600">Total Records: {filteredData.length}</div>
{sortColumn && (
  <div className="text-sm text-gray-500 italic inline-block">
    Sorted by:{" "}
    <span className="font-semibold">{columns.find(c => c.accessor === sortColumn)?.header}</span>{" "}
    
    ({sortDirection === "asc" ? "Ascending" : "Descending"})
    <Trash2 className="float-end w-3 h-3 mt-1 cursor-pointer text-red-400 hover:text-red-500" onClick={()=>setSortColumn(null)}/>
  </div>
)}
      </div>
      {/* Render Selected View */}
      {view === "table" ? renderTable() : view === "card" ? renderCard() : renderList()}

      {/* Pagination */}
      {isClient && totalPages > 1 ? renderPagination():<>
      <div className="flex justify-end items-center gap-2 mt-2">
      <Button size="sm" disabled={true} >Prev</Button>
      <span className="px-2">Page {page} of {totalPages || 1}</span>
      <Button size="sm" disabled={true} >Next</Button>
    </div>
      </>}
    </div>
  );
};

export default ReusableTable;