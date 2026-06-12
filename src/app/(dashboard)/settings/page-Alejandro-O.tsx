import { RoleGuard } from "@/components/auth/RoleGuard";
import { SettingsPage } from "@/components/settings/SettingsPage";
import { AUTHENTICATED_ROLES } from "@/lib/auth/permissions";

export default function Page() {
  return (
    <RoleGuard allowedRoles={AUTHENTICATED_ROLES}>
      <SettingsPage />
    </RoleGuard>
  );
}
