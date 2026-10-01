import type { ReactNode } from "react";
import { Navigation } from "./Navigation";
import { CustomCursor } from "./CustomCursor";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Navigation />
      <main id="main-content" className="page-shell" tabIndex={-1}>{children}</main>
      <CustomCursor />
    </>
  );
}
