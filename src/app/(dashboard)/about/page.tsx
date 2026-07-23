import { RoleGuard } from "@/components/auth/RoleGuard";
import { AboutUsPage } from "@/components/about/AboutUsPage";
import { PageHeader } from "@/components/ui/PageHeader";
import { AUTHENTICATED_ROLES } from "@/lib/auth/permissions";

export default function Page() {
  return (
    <RoleGuard allowedRoles={AUTHENTICATED_ROLES}>
      <PageHeader
        title="Acerca de SmartGuard 360"
        description="Sistema IoT de monitoreo para restaurantes y cocinas inteligentes."
      />
      <AboutUsPage />
    </RoleGuard>
  );
}
