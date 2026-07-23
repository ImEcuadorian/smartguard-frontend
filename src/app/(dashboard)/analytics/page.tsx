import { RoleGuard } from "@/components/auth/RoleGuard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { ADMIN_ROLES } from "@/lib/auth/permissions";

export default function Page() {
  return (
    <RoleGuard allowedRoles={ADMIN_ROLES}>
      <AdminDashboard initialTab="analytics" />
    </RoleGuard>
  );
}
