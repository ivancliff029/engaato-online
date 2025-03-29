// app/components/FooterWrapper.js
"use client";

import React from 'react';
import { usePathname } from "next/navigation";

const FooterWrapper = ({ children }) => {
  const pathname = usePathname();
  const isDashboardRoute = pathname === "/dashboard" || pathname?.startsWith("/dashboard/");
  
  // Only render children (Footer) when not on dashboard routes
  if (isDashboardRoute) {
    return null;
  }
  
  return <>{children}</>;
};

export default FooterWrapper;