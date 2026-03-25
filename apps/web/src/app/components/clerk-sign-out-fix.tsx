"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __internal_onBeforeSetActive?: (intent?: string) => Promise<unknown> | unknown;
  }
}

export function ClerkSignOutFix() {
  useEffect(() => {
    const originalBeforeSetActive = window.__internal_onBeforeSetActive;

    window.__internal_onBeforeSetActive = (intent?: string) => {
      if (intent === "sign-out") {
        return Promise.resolve();
      }

      return originalBeforeSetActive?.(intent);
    };

    return () => {
      window.__internal_onBeforeSetActive = originalBeforeSetActive;
    };
  }, []);

  return null;
}
