// src/components/shifts/ShiftList.jsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ShiftList = ({
  shifts,
  selectedId,
  onSelect,
  currentPage,
  totalPages,
  onNext,
  onPrev,
}) => {
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
              {shifts?.map((shift) => (
                <tr
                  key={shift.id}
                  className={`border-b cursor-pointer transition ${
                    shift.id === selectedId
                      ? "bg-indigo-100 dark:bg-neutral-600 font-semibold"
                      : ""
                  }`}
                  onClick={() => onSelect(shift.id)}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(shift.id);
                      }}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            disabled={currentPage === 0}
            onClick={onPrev}
          >
            Previous
          </Button>

          <span className="text-sm">
            Page {currentPage + 1} of {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={currentPage >= totalPages - 1}
            onClick={onNext}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShiftList;