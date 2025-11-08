import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Performance Dashboard",
  description: "View and analyze performance metrics",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

