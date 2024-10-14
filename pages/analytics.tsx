// import Charts from "@/components/charts/charts";
import EngineeringTable from "@/components/engineeringTable/engineeringTable";
import { getAuthTokenCookie } from "@/utils/auth";
import dynamic from "next/dynamic";
import router from "next/router";
import { useLayoutEffect } from "react";

const Charts = dynamic(() => import("../components/charts/charts"), {
  ssr: false,
});

const Analytics = () => {
  useLayoutEffect(() => {
    if (!getAuthTokenCookie()) {
      router.push("/login");
    }
  }, []);

  return (
    <div className="h-full overflow-auto pr-1">
      <EngineeringTable />
    </div>
  );
};

export default Analytics;
