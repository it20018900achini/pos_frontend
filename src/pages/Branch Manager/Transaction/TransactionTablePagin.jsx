import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions, fetchAllTransactions } from "@/Redux Toolkit/features/transactions/transactionsSlice";
// import { getRecentRefundsByBranchPagin } from "@/Redux Toolkit/features/transactions/transactionsSlice";

import Pagination from "./Pagination";
import { format } from "date-fns";

function toCsv(rows) {
  if (!rows || rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map(r => headers.map(h => {
      const v = r[h];
      if (v === null || v === undefined) return "";
      const s = typeof v === "string" ? v : String(v);
      // escape quotes
      return `"${s.replace(/"/g, '""')}"`;
    }).join(","))
  ].join("\n");
  return csv;
}

export default function TransactionTablePagin() {
  const dispatch = useDispatch();
  const {
    loading, content, page, size, totalPages, totalElements, error,
    allLoading, allContent
  } = useSelector(state => state.transactions);

  // local filters
  const [branchIdsInput, setBranchIdsInput] = useState("1,2"); // default example
  const [startDateInput, setStartDateInput] = useState("");
  const [endDateInput, setEndDateInput] = useState("");
  const [paymentTypeInput, setPaymentTypeInput] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    // initial load
    handleFetch(currentPage, pageSize);
    // eslint-disable-next-line
  }, []);

  const buildDatesForApi = (start, end) => {
    // API expects full ISO local date-time (e.g. 2025-11-01T00:00:00)
    const startIso = start ? `${start}T00:00:00` : null;
    const endIso = end ? `${end}T23:59:59` : null;
    return { startIso, endIso };
  }

  const handleFetch = (p = 0, s = pageSize) => {
    if (!branchIdsInput) {
      alert("Enter branchIds (comma separated)");
      return;
    }
    const { startIso, endIso } = buildDatesForApi(startDateInput, endDateInput);
    setCurrentPage(p);
    setPageSize(s);
    dispatch(fetchTransactions({
      branchIds: branchIdsInput,
      startDate: startIso,
      endDate: endIso,
      paymentType: paymentTypeInput || undefined,
      page: p,
      size: s
    }));
  };

  const handleFetchAll = () => {
    if (!branchIdsInput) {
      alert("Enter branchIds (comma separated)");
      return;
    }
    const { startIso, endIso } = buildDatesForApi(startDateInput, endDateInput);
    dispatch(fetchAllTransactions({
      branchIds: branchIdsInput,
      startDate: startIso,
      endDate: endIso,
      paymentType: paymentTypeInput || undefined
    }));
  };

  const downloadCsv = (rows, filename = "transactions.csv") => {
    const csv = toCsv(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
      <h2>Merged Transactions (Orders / Refunds / Customer Payments)</h2>

      <div style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "center" }}>
        <label>
          Branch IDs (comma):<br/>
          <input value={branchIdsInput} onChange={e => setBranchIdsInput(e.target.value)} placeholder="1,2" />
        </label>

        <label>
          Start date (YYYY-MM-DD):<br/>
          <input value={startDateInput} onChange={e => setStartDateInput(e.target.value)} placeholder="2025-11-01" />
        </label>

        <label>
          End date (YYYY-MM-DD):<br/>
          <input value={endDateInput} onChange={e => setEndDateInput(e.target.value)} placeholder="2025-11-30" />
        </label>

        <label>
          Payment Type:<br/>
          <input value={paymentTypeInput} onChange={e => setPaymentTypeInput(e.target.value)} placeholder="CASH" />
        </label>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <button onClick={() => handleFetch(0, pageSize)}>Search</button>
          <button onClick={handleFetchAll} disabled={allLoading}>{allLoading ? "Loading..." : "Fetch All"}</button>
        </div>
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>Page size:
          <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); handleFetch(0, Number(e.target.value)); }}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </label>
        <span style={{ marginLeft: 12 }}>Total: {totalElements} items</span>
        <button style={{ marginLeft: 12 }} onClick={() => downloadCsv(content, `transactions_page_${currentPage}.csv`)} disabled={!content || content.length===0}>Download Page CSV</button>
        <button style={{ marginLeft: 8 }} onClick={() => downloadCsv(allContent, `transactions_all.csv`)} disabled={!allContent || allContent.length===0}>Download All CSV</button>
      </div>

      {loading ? <p>Loading...</p> : null}
      {error ? <p style={{ color: "red" }}>{JSON.stringify(error)}</p> : null}

      <table border="1" cellPadding="6" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Type</th>
            <th>ID</th>
            <th>Customer</th>
            <th>Cashier</th>
            <th>Amount</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {content && content.length > 0 ? content.map((row) => (
            <tr key={`${row.type}-${row.id}`}>
              <td>{row.type}</td>
              <td>{row.id}</td>
              <td>{row.customerName}</td>
              <td>{row.cashierName}</td>
              <td>{row.amount ?? ""}</td>
              <td>{row.paymentMethod}</td>
              <td>{row.status}</td>
              <td>{row.createdAt ? format(new Date(row.createdAt), "yyyy-MM-dd HH:mm:ss") : ""}</td>
            </tr>
          )) : (
            <tr><td colSpan="8" style={{ textAlign: "center" }}>No results</td></tr>
          )}
        </tbody>
      </table>

      <Pagination page={page || currentPage} totalPages={totalPages} onChange={(p) => { handleFetch(p, pageSize); }} />
    </div>
  );
}
