"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const RouteTracker = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("lastVisitedUrl", pathname);
    }
  }, [pathname]);

  return null;
};

export default RouteTracker;
