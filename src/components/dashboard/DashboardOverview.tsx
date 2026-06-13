"use client";

import { useAuth } from "@/hooks/useAuth";
import { LoadingState } from "@/components/ui/LoadingState";
import { AdminDashboard } from "./AdminDashboard";
import { ClientDashboard } from "./ClientDashboard";

export function DashboardOverview() {
  const { role } = useAuth();

  if (!role) {
    return <LoadingState label="Preparando dashboard" />;
  }

  if (role === "VIEWER") {
    return <ClientDashboard />;
  }

  return <AdminDashboard />;
}
