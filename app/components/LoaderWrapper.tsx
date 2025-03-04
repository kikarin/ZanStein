"use client";

import { useState, useEffect } from "react";
import Loader from "./Loader";

export default function LoaderWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <Loader setIsLoading={setIsLoading} />;

  return <>{children}</>;
}
