import { RoleGuard } from "@/components/auth/RoleGuard";
import { UsersPage } from "@/components/users/UsersPage";
import { ADMIN_ROLES } from "@/lib/auth/permissions";

export default function Page() {
  return (
    <RoleGuard allowedRoles={ADMIN_ROLES}>
      <UsersPage />
    </RoleGuard>
  );
}
