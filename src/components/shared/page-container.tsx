import type { ReactNode } from "react";
import { PageHeader } from "./page-header";

interface PageContainerProps {
  children: ReactNode;
  withHeader?: boolean;
  className?: string;
}

export function PageContainer({ children, withHeader = true, className = "" }: PageContainerProps) {
  return (
    <div className="h-screen py-1 px-2">
      <div className="rounded-3xl bg-card border border-blue-200 h-full flex flex-col overflow-hidden">
        {withHeader && <PageHeader />}
        <div className={className || "p-6 md:p-8 overflow-y-auto flex-1"}>{children}</div>
      </div>
    </div>
  );
}
