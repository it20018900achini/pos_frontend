import { useEffect, useState } from "react";
import { useStartShiftMutation } from "../../Redux Toolkit/features/shift/shiftApi";
// import { useGetUserProfileQuery } from "../../Redux Toolkit/features/user/userApi";
import { useDispatch } from "react-redux";

export default function StartShiftForm({ branch }) {
  const dispatch = useDispatch();

  const [branchId, setBranchId] = useState(branch?.id || "");
  const [openingCash, setOpeningCash] = useState("");
  const handleCoinChange = (denom, value) => {
    setOpeningCoins((prev) => ({
      ...prev,
      [denom]: Number(value),
    }));
  };
  const [openingCoins, setOpeningCoins] = useState({
    "1": 0,
    "5": 0,
    "10": 0,
    "50": 0,
    "100": 0,
    "500": 0,
  });

  const [startShift, { isLoading, error }] = useStartShiftMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await startShift({
        branchId: Number(branchId),
        openingCash: Number(openingCash),
        openingCoins,
      }).unwrap();

      // ✅ THIS IS THE KEY LINE
      dispatch(getUserProfile());

    } catch (err) {
      console.error("Failed to start shift", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md space-y-4 rounded-lg border p-6 shadow"
    >
      <h2 className="text-xl font-semibold">Start Shift</h2>

      <input
        type="number"
        value={branchId}
        onChange={(e) => setBranchId(e.target.value)}
        required
        className="w-full rounded border px-3 py-2"
      />

      <input
        type="number"
        value={openingCash}
        onChange={(e) => setOpeningCash(e.target.value)}
        required
        min="0"
        className="w-full rounded border px-3 py-2"
      />

      <div className="grid grid-cols-3 gap-2">
        {Object.keys(openingCoins).map((denom) => (
          <input
            key={denom}
            type="number"
            min="0"
            value={openingCoins[denom]}
            onChange={(e) => handleCoinChange(denom, e.target.value)}
            className="rounded border px-2 py-1 text-sm"
            placeholder={denom}
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded bg-black py-2 text-white disabled:opacity-50"
      >
        {isLoading ? "Starting..." : "Start Shift"}
      </button>

      {error && (
        <p className="text-sm text-red-600">
          {error?.data?.message || "Failed to start shift"}
        </p>
      )}
    </form>
  );
}

