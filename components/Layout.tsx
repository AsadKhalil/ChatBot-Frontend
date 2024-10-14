import React, { useEffect, useState } from "react";
import NavigationBar from "./navbar/NavigationBar";
import Sidebar from "./Sidebar";
import useCheckMobileScreen from "@/hooks/useCheckMobileScreen";

const Layout = ({ children }: any) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const collapsedHandler = () => {
    setIsCollapsed(!isCollapsed);
  };
  const isTab = useCheckMobileScreen(992);
  const isMobile = useCheckMobileScreen(650);

  useEffect(() => {
    setIsCollapsed(isTab);
  }, [isTab]);
  return (
    <div
      className={`grid  ${isMobile ? "grid-cols-1 " : "grid-cols-[auto_1fr]"}`}>
      <Sidebar collapsedHandler={collapsedHandler} isCollapsed={isCollapsed} />
      <div className="px-6 overflow-auto ">
        <NavigationBar
          isCollapsed={isCollapsed}
          collapsedHandler={collapsedHandler}
        />
        <main
          className={`h-[calc(100dvh-86px)] md:h-[calc(100dvh-110px)] max-h-full bg-[#F6F8FF] ease-linear duration-200 `}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
