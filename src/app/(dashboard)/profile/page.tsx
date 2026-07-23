import { RoleGuard } from "@/components/auth/RoleGuard";
import { ProfilePage } from "@/components/profile/ProfilePage";
import { AUTHENTICATED_ROLES } from "@/lib/auth/permissions";

export default function Page() {
  return (
    <RoleGuard allowedRoles={AUTHENTICATED_ROLES}>
      <ProfilePage />
    </RoleGuard>
  );
}
