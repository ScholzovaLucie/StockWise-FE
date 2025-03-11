"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RouteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lastVisitedUrl", pathname);
    }
  }, [pathname]); // Uloží URL pokaždé, když se změní pathname

  return null;
}
