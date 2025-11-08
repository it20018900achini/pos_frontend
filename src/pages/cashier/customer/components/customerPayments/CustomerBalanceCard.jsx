export function CustomerBalanceCard({ customerName, totalPaid, totalDue }) {
  return (
    <div className="p-4 border rounded-xl shadow-sm bg-white">
      <h2 className="text-lg font-semibold">{customerName}</h2>
      <p className="mt-2 text-gray-600">
        <strong>Total Paid:</strong> Rs {totalPaid?.toFixed(2)}
      </p>
      <p className="text-gray-600">
        <strong>Total Due:</strong> Rs {totalDue?.toFixed(2)}
      </p>
    </div>
  );
}
