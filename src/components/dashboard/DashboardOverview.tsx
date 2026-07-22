"use client";

import { useAuth } from "@/hooks/useAuth";
import { LoadingState } from "@/components/ui/LoadingState";
import { AdminDashboard } from "./AdminDashboard";
import { ClientDashboard } from "./ClientDashboard";
import { OperatorDashboard } from "./OperatorDashboard";

export function DashboardOverview() {
  const { role } = useAuth();

  if (!role) {
    return <LoadingState label="Preparando dashboard" />;
  }

  if (role === "ADMIN") {
    return <AdminDashboard />;
  }

  if (role === "OPERATOR") {
    return <OperatorDashboard />;
  }

  if (role === "VIEWER") {
    return <ClientDashboard />;
  }

  return <ClientDashboard />;
}
