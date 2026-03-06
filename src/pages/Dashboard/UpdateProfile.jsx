"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  findEmployeeById,
  updateEmployee,
} from "@/Redux Toolkit/features/employee/employeeThunks";
import ContentLayout from "./ContentLayout";

const UpdateProfile = ({ onClose }) => {
  const dispatch = useDispatch();
  const { userProfile } = useSelector((state) => state.user);
  const { employee, loading } = useSelector((state) => state.employee);

  const token = localStorage.getItem("jwt");
  const employeeId = userProfile?.user?.id;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  // Load employee
  useEffect(() => {
    if (employeeId) {
      dispatch(findEmployeeById({ employeeId, token }));
    }
  }, [employeeId, dispatch, token]);

  // Fill form
  useEffect(() => {
    if (employee) {
      setFormData({
        fullName: employee.fullName || "",
        email: employee.email || "",
        phone: employee.phone || "",
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(
      updateEmployee({
        employeeId,
        employeeDetails: formData,
        token,
      })
    );
    if (onClose) onClose();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <ContentLayout title="Update Profile">
      <div className="bg-white p-6 rounded shadow w-full max-w-lg">
        <h2 className="text-xl font-bold mb-6">Update Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Update Profile
          </button>

        </form>
      </div>
    </ContentLayout>
  );
};

export default UpdateProfile;