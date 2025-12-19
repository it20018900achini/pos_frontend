import React, { useEffect, useState } from "react";
import API from "./api";
import dayjs from "dayjs";
import { ShiftHeader } from "./components";
import POSHeader from "../components/POSHeader";
import ShiftSummaryPageOld from "./ShiftSummaryPageOld";

function ShiftSummaryPage() {
  const [shifts, setShifts] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [openingCash, setOpeningCash] = useState("");
  const [actualCash, setActualCash] = useState("");
  const [currentShift, setCurrentShift] = useState(null);

  const fetchShifts = async () => {
    try {
      const res = await API.get("/all");
      setShifts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCurrentShift = async () => {
    try {
      const res = await API.get("/current");
      setCurrentShift(res.data);
    } catch (err) {
      setCurrentShift(null);
    }
  };

  useEffect(() => {
    fetchShifts();
    fetchCurrentShift();
  }, []);

  const handleStartShift = async () => {
    try {
      await API.post(`/start?branchId=${branchId}&openingCash=${openingCash}`);
      fetchShifts();
      fetchCurrentShift();
      setBranchId("");
      setOpeningCash("");
    } catch (err) {
      alert(err.response?.data || "Error starting shift");
    }
  };

  const handleEndShift = async () => {
    try {
      await API.post(`/end?actualCash=${actualCash}`);
      fetchShifts();
      fetchCurrentShift();
      setActualCash("");
    } catch (err) {
      alert(err.response?.data || "Error ending shift");
    }
  };

  const handleDeleteShift = async (id) => {
    if (!window.confirm("Are you sure you want to delete this shift?")) return;
    try {
      await API.delete(`/${id}`);
      fetchShifts();
    } catch (err) {
      alert(err.response?.data || "Error deleting shift");
    }
  };

  const renderShiftDetails = (shift) => (
    <div className="bg-gray-50 p-3 rounded shadow my-2">
      <h4 className="font-semibold mb-1">Shift Details</h4>
      <p>Opening Cash: {shift.openingCash}</p>
      <p>Expected Cash: {shift.expectedCash}</p>
      <p>Actual Cash: {shift.actualCash}</p>
      <p>Cash Difference: {shift.cashDifference}</p>
      <p>Total Sales: {shift.totalSales}</p>
      <p>Total Refunds: {shift.totalRefunds}</p>
      <p>Net Sales: {shift.netSales}</p>
      <p>Total Orders: {shift.totalOrders}</p>

      {/* Payment Summaries */}
      <div className="mt-2">
        <h5 className="font-semibold">Payment Summaries:</h5>
        {shift.paymentSummaries?.length > 0 ? (
          <ul className="list-disc pl-5">
            {shift.paymentSummaries.map((ps, index) => (
              <li key={index}>
                {ps.type} - Amount: {ps.totalAmount} - Transactions: {ps.transactionCount}
              </li>
            ))}
          </ul>
        ) : (
          <p>No payment summary</p>
        )}
      </div>

      {/* Recent Orders */}
      <div className="mt-2">
        <h5 className="font-semibold">Recent Orders:</h5>
        {shift.recentOrders?.length > 0 ? (
          <ul className="list-disc pl-5">
            {shift.recentOrders.map((order) => (
              <li key={order.id}>
                Order #{order.id} - Total: {order.totalAmount} - Time: {dayjs(order.createdAt).format("HH:mm")}
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent orders</p>
        )}
      </div>

      {/* Top Selling Products */}
      <div className="mt-2">
        <h5 className="font-semibold">Top Selling Products:</h5>
        {shift.topSellingProducts?.length > 0 ? (
          <ul className="list-disc pl-5">
            {shift.topSellingProducts.map((p) => (
              <li key={p.id}>{p.name}</li>
            ))}
          </ul>
        ) : (
          <p>No top-selling products</p>
        )}
      </div>

      {/* Refunds */}
      <div className="mt-2">
        <h5 className="font-semibold">Refunds:</h5>
        {shift.refunds?.length > 0 ? (
          <ul className="list-disc pl-5">
            {shift.refunds.map((r) => (
              <li key={r.id}>
                Refund #{r.id} - Amount: {r.totalAmount} - Time: {dayjs(r.createdAt).format("HH:mm")}
              </li>
            ))}
          </ul>
        ) : (
          <p>No refunds</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="">
          <POSHeader />
      <ShiftHeader />
      <h2 className="text-2xl font-bold mb-4">Shift Management</h2>

      {/* Current Shift */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-semibold mb-2">Current Shift</h3>
        {currentShift ? renderShiftDetails(currentShift) : <p>No shift currently open</p>}
      </div>

      {/* Start Shift */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-semibold mb-2">Start Shift</h3>
        <input
          type="number"
          placeholder="Branch ID"
          value={branchId}
          onChange={(e) => setBranchId(e.target.value)}
          className="border p-2 mr-2 rounded"
        />
        <input
          type="number"
          placeholder="Opening Cash"
          value={openingCash}
          onChange={(e) => setOpeningCash(e.target.value)}
          className="border p-2 mr-2 rounded"
        />
        <button
          onClick={handleStartShift}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Start
        </button>
      </div>

      {/* End Shift */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-semibold mb-2">End Shift</h3>
        <input
          type="number"
          placeholder="Actual Cash"
          value={actualCash}
          onChange={(e) => setActualCash(e.target.value)}
          className="border p-2 mr-2 rounded"
        />
        <button
          onClick={handleEndShift}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          End
        </button>
      </div>

      {/* All Shifts */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">All Shifts</h3>
        {shifts.map((shift) => (
          <div key={shift.id} className="border-b py-2">
            <div className="flex justify-between items-center mb-1">
              <p>
                Shift #{shift.id} - Branch: {shift.branchId} - Cashier: {shift.cashierId} - Start:{" "}
                {dayjs(shift.shiftStart).format("YYYY-MM-DD HH:mm")} - End:{" "}
                {shift.shiftEnd ? dayjs(shift.shiftEnd).format("YYYY-MM-DD HH:mm") : "-"}
              </p>
              <button
                onClick={() => handleDeleteShift(shift.id)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
            {renderShiftDetails(shift)}
          </div>
        ))}
      </div>
      {/* <ShiftSummaryPageOld/> */}
    </div>
  );
}

export default ShiftSummaryPage;
