import React, { useState } from "react";
import ChequeForm from "../components/cheques/ChequeForm";
import ChequeList from "../components/cheques/ChequeList";

const ChequesPage = () => {
  const [filters, setFilters] = useState({ type: "RECEIVED", status: "" });
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="space-y-6 p-4">
      <ChequeForm onCreated={() => setRefresh(!refresh)} />

      <div className="space-x-2">
        <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
          <option value="RECEIVED">Received</option>
          <option value="PAID">Paid</option>
        </select>

        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="CLEARED">Cleared</option>
          <option value="BOUNCED">Bounced</option>
        </select>
      </div>

      <ChequeList type={filters.type} status={filters.status} key={refresh} />
    </div>
  );
};

export default ChequesPage;
