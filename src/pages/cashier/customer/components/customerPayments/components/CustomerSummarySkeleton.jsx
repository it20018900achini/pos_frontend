import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CustomerSummarySkeleton = () => {
  // Number of KPI cards to display in skeleton
  const skeletonKPIs = Array(8).fill(0); // adjust based on your total KPIs

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {skeletonKPIs.map((_, idx) => (
        <Card key={idx} className="rounded-xl shadow-md animate-pulse">
          <CardContent className="p-5 flex justify-between items-center">
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-24 rounded-full" /> {/* title */}
              <Skeleton className="h-8 w-32 rounded-md" /> {/* value */}
              <Skeleton className="h-3 w-16 rounded-full" /> {/* change */}
            </div>
            <Skeleton className="h-10 w-10 rounded-full" /> {/* icon */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CustomerSummarySkeleton;
