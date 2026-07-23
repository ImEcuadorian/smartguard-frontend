import { RoleGuard } from "@/components/auth/RoleGuard";
import { AboutUsPanel } from "@/components/dashboard/AboutUsPanel";
import { PageHeader } from "@/components/ui/PageHeader";
import { AUTHENTICATED_ROLES } from "@/lib/auth/permissions";

export default function Page() {
  return (
    <RoleGuard allowedRoles={AUTHENTICATED_ROLES}>
      <PageHeader
        title="Acerca de nosotros"
        description="Informacion del proyecto SmartGuard para usuarios finales."
      />
      <AboutUsPanel />
    </RoleGuard>
  );
}
