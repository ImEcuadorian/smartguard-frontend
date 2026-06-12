import { RoleGuard } from "@/components/auth/RoleGuard";
import { DevicesPage } from "@/components/devices/DevicesPage";
import { AUTHENTICATED_ROLES } from "@/lib/auth/permissions";

export default function Page() {
  return (
    <RoleGuard allowedRoles={AUTHENTICATED_ROLES}>
      <DevicesPage />
    </RoleGuard>
  );
}
