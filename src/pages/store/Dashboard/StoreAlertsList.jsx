import React from "react";
import { useSelector } from "react-redux";
import { Bell, AlertCircle, Info } from "lucide-react";

export default function StoreAlertsList() {
  const { storeAlerts } = useSelector((state) => state.storeAnalytics);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800">Operational Alerts</h3>
        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
          {storeAlerts?.criticalAlertsCount || 0} Critical
        </span>
      </div>
      <div className="space-y-4">
        {storeAlerts?.alerts?.length > 0 ? (
          storeAlerts.alerts.map((alert, idx) => (
            <div key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              {alert.type === 'CRITICAL' ? (
                <AlertCircle className="text-rose-500 shrink-0" />
              ) : (
                <Info className="text-blue-500 shrink-0" />
              )}
              <div>
                <p className="text-sm font-semibold text-slate-900">{alert.title}</p>
                <p className="text-xs text-slate-500">{alert.message}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-slate-400 py-10">No active alerts. Store is healthy!</p>
        )}
      </div>
    </div>
  );
}