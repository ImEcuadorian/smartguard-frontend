"use client";

import { UserManagementPanel } from "./UserManagementPanel";
import { PageHeader } from "@/components/ui/PageHeader";

export function UsersPage() {
  return (
    <>
      <PageHeader
        title="Clientes / Usuarios"
        description="Gestion administrativa de cuentas SmartGuard 360. VIEWER se presenta como cliente en el frontend."
      />
      <UserManagementPanel />
    </>
  );
}
