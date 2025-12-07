import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { useSelector, useDispatch } from "react-redux";
import { updateBranch } from "../../../Redux Toolkit/features/branch/branchThunks";
import { Input } from "@/components/ui/input";
import { Phone, Mail, Clock, Save } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator";
import { Checkbox } from "../../../components/ui/checkbox";

const BranchInfo = () => {
  const dispatch = useDispatch();
  const { branch, loading } = useSelector((state) => state.branch); // assume loading state in slice
  const [branchInfo, setBranchInfo] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    openTime: "",
    closeTime: "",
    workingDays: [],
  });

  useEffect(() => {
    if (branch) {
      setBranchInfo({
        name: branch.name || "",
        address: branch.address || "",
        phone: branch.phone || "",
        email: branch.email || "",
        openTime: branch.openTime || "",
        closeTime: branch.closeTime || "",
        workingDays: branch.workingDays || [],
      });
    }
  }, [branch]);

  const handleBranchInfoChange = (field, value) => {
    setBranchInfo({
      ...branchInfo,
      [field]: value,
    });
  };

  const handleSaveSettings = async () => {
    try {
      await dispatch(
        updateBranch({
          id: branch.id,
          dto: branchInfo,
          jwt: localStorage.getItem("jwt"),
        })
      ).unwrap(); // unwrap to catch errors
      console.log("Branch info saved:", branchInfo);
    } catch (err) {
      console.error("Failed to save branch info:", err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branch Information</CardTitle>
        <CardDescription>Update your branch details and business hours.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Branch Info Inputs */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Branch Name</label>
              <Input
                value={branchInfo.name}
                onChange={(e) => handleBranchInfoChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Input
                value={branchInfo.address}
                onChange={(e) => handleBranchInfoChange("address", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-gray-500" />
                <Input
                  value={branchInfo.phone}
                  onChange={(e) => handleBranchInfoChange("phone", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-gray-500" />
                <Input
                  type="email"
                  value={branchInfo.email}
                  onChange={(e) => handleBranchInfoChange("email", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Business Hours */}
        <div>
          <h3 className="text-lg font-medium mb-4">Business Hours</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Opening Time</label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                <Input
                  type="time"
                  value={branchInfo.openTime}
                  onChange={(e) => handleBranchInfoChange("openTime", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Closing Time</label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                <Input
                  type="time"
                  value={branchInfo.closeTime}
                  onChange={(e) => handleBranchInfoChange("closeTime", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium">Working Days</label>
            <div className="grid grid-cols-2 gap-2 mt-2 md:grid-cols-4">
              {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    checked={branchInfo.workingDays.includes(day)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleBranchInfoChange("workingDays", [...branchInfo.workingDays, day]);
                      } else {
                        handleBranchInfoChange(
                          "workingDays",
                          branchInfo.workingDays.filter((d) => d !== day)
                        );
                      }
                    }}
                  />
                  <label className="text-sm text-gray-700">{day}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            className="gap-2"
            onClick={handleSaveSettings}
            disabled={loading} // disable while saving
          >
            {loading ? (
              <svg
                className="animate-spin h-4 w-4 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            ) : (
              <Save className="h-4 w-4" />
            )}
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BranchInfo;
