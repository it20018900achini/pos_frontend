// src/components/shifts/ShiftList.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchShifts } from "../../../../Redux Toolkit/features/shift/shiftSlice";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ShiftList = ({ onSelect }) => {
  const dispatch = useDispatch();

  const {
    shifts,          // content array
    loading,
    error,
    totalPages,
    currentPage,
    pageSize
  } = useSelector((state) => state.shift);

  const { selectedBranchId } = useSelector((state) => state.user);

  const [selectedId, setSelectedId] = useState(null);

  // Fetch shifts when branch or page changes
  useEffect(() => {
    if (selectedBranchId) {
      dispatch(
        fetchShifts({
          branchId: selectedBranchId,
          page: currentPage || 0,
          size: pageSize || 10,
        })
      );
    }
  }, [dispatch, selectedBranchId, currentPage]);

  // Auto-select first shift
  useEffect(() => {
    if (shifts && shifts.length > 0 && selectedId === null) {
      setSelectedId(shifts[0].id);
      onSelect(shifts[0].id);
    }
  }, [shifts, onSelect, selectedId]);

  const handleSelect = (id) => {
    setSelectedId(id);
    onSelect(id);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      dispatch(
        fetchShifts({
          branchId: selectedBranchId,
          page: currentPage + 1,
          size: pageSize,
        })
      );
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      dispatch(
        fetchShifts({
          branchId: selectedBranchId,
          page: currentPage - 1,
          size: pageSize,
        })
      );
    }
  };

  if (loading) return <p>Loading shifts...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!Array.isArray(shifts) || shifts.length === 0)
    return <p>No shifts found</p>;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>All Shifts</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-200 rounded-md">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-left">ID</th>
                <th className="px-4 py-2 border-b text-left">Start</th>
                <th className="px-4 py-2 border-b text-left">End</th>
                <th className="px-4 py-2 border-b text-left">Status</th>
                <th className="px-4 py-2 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map((shift) => (
                <tr
                  key={shift.id}
                  className={`border-b cursor-pointer transition ${
                    shift.id === selectedId
                      ? "bg-indigo-100 dark:bg-neutral-600 font-semibold"
                      : ""
                  }`}
                  onClick={() => handleSelect(shift.id)}
                >
                  <td className="px-4 py-2">{shift.id}</td>
                  <td className="px-4 py-2">
                    {new Date(shift.shiftStart).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    {shift.shiftEnd
                      ? new Date(shift.shiftEnd).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2">{shift.status}</td>
                  <td className="px-4 py-2">
                    <Button
                      size="sm"
                      variant={
                        shift.id === selectedId ? "default" : "outline"
                      }
                      onClick={() => handleSelect(shift.id)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            disabled={currentPage === 0}
            onClick={handlePrev}
          >
            Previous
          </Button>

          <span className="text-sm">
            Page {currentPage + 1} of {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={currentPage >= totalPages - 1}
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShiftList;