import { useState } from "react";
import { useStartShiftMutation } from "../../Redux Toolkit/features/shift/shiftApi";

export default function StartShiftForm({ branch }) {
  const [branchId, setBranchId] = useState(branch?.id || "");
  const [openingCash, setOpeningCash] = useState("");

  const [openingCoins, setOpeningCoins] = useState({
    "1": 0,
    "5": 0,
    "10": 0,
    "50": 0,
    "100": 0,
    "500": 0,
  });

  const [startShift, { isLoading, error }] = useStartShiftMutation();

  const handleCoinChange = (denom, value) => {
    setOpeningCoins((prev) => ({
      ...prev,
      [denom]: Number(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await startShift({
        branchId: Number(branchId),
        openingCash: Number(openingCash),
        openingCoins,
      }).unwrap();

      // 🔥 Hard reload
      // window.location.reload();
    } catch (err) {
      console.error("Failed to start shift", err);
    }
  };

  return (
    /* 🔥 FULL PAGE CENTER */
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-xl border bg-white p-6 shadow-lg"
      >
        <h2 className="text-center text-xl font-semibold">
          Start Shift2-
        </h2>

        {/* Branch ID */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Branch ID</label>
          <input
            type="number"
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            required
            className="w-full rounded border px-3 py-2"
          />
        </div>

        {/* Opening Cash */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Opening Cash</label>
          <input
            type="number"
            min="0"
            value={openingCash}
            onChange={(e) => setOpeningCash(e.target.value)}
            required
            className="w-full rounded border px-3 py-2"
          />
        </div>

        {/* Coins */}
        <div>
          <p className="mb-2 text-sm font-medium">Opening Coins</p>

          <div className="grid grid-cols-3 gap-3">
            {Object.keys(openingCoins).map((denom) => (
              <div key={denom} className="space-y-1">
                <label className="text-xs text-muted-foreground">
                  Rs. {denom}
                </label>
                <input
                  type="number"
                  min="0"
                  value={openingCoins[denom]}
                  onChange={(e) =>
                    handleCoinChange(denom, e.target.value)
                  }
                  className="w-full rounded border px-2 py-1 text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded bg-black py-2 text-white disabled:opacity-50"
        >
          {isLoading ? "Starting..." : "Start Shift"}
        </button>

        {error && (
          <p className="text-center text-sm text-red-600">
            {error?.data?.message || "Failed to start shift"}
          </p>
        )}
      </form>
    </div>
  );
}
