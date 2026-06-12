import { RoleGuard } from "@/components/auth/RoleGuard";
import { AlertsPage } from "@/components/alerts/AlertsPage";
import { AUTHENTICATED_ROLES } from "@/lib/auth/permissions";

export default function Page() {
  return (
    <RoleGuard allowedRoles={AUTHENTICATED_ROLES}>
      <AlertsPage />
    </RoleGuard>
  );
}
