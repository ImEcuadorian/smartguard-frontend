"use client";

import { useAuth } from "@/hooks/useAuth";
import { ClientDashboard } from "./ClientDashboard";
import { AdminDashboard } from "./AdminDashboard";

export function DashboardOverview() {
  const { role } = useAuth();

  if (role === "VIEWER") {
    return <ClientDashboard />;
  }

  return <AdminDashboard />;
}
