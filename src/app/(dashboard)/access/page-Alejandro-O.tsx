import { RoleGuard } from "@/components/auth/RoleGuard";
import { AccessPage } from "@/components/access/AccessPage";
import { AUTHENTICATED_ROLES } from "@/lib/auth/permissions";

export default function Page() {
  return (
    <RoleGuard allowedRoles={AUTHENTICATED_ROLES}>
      <AccessPage />
    </RoleGuard>
  );
}
