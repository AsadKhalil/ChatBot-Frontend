import { useEffect, useState } from "react";

const useCheckMobileScreen = (breakpoint = 768) => {
  //   const [width, setWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  const handleWindowSizeChange = () => {
    // setWidth(window.innerWidth);
    setIsMobile(window.innerWidth < breakpoint);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, [breakpoint]);

  return isMobile;
};

export default useCheckMobileScreen;
