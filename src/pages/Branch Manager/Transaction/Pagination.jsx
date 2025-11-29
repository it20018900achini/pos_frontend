import React from "react";

export default function Pagination({ page, totalPages, onChange }) {
  const prev = () => onChange(Math.max(0, page - 1));
  const next = () => onChange(Math.min(totalPages - 1, page + 1));

  if (totalPages === 0) return null;

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
      <button onClick={prev} disabled={page <= 0}>Prev</button>
      <span>Page {page + 1} of {totalPages}</span>
      <button onClick={next} disabled={page >= totalPages - 1}>Next</button>
    </div>
  );
}
