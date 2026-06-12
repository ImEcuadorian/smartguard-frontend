import { RoleGuard } from "@/components/auth/RoleGuard";
import { SensorsPage } from "@/components/sensors/SensorsPage";
import { AUTHENTICATED_ROLES } from "@/lib/auth/permissions";

export default function Page() {
  return (
    <RoleGuard allowedRoles={AUTHENTICATED_ROLES}>
      <SensorsPage />
    </RoleGuard>
  );
}
