import { RoleGuard } from "@/components/auth/RoleGuard";
import { ActuatorsPage } from "@/components/actuators/ActuatorsPage";
import { OPERATION_ROLES } from "@/lib/auth/permissions";

export default function Page() {
  return (
    <RoleGuard allowedRoles={OPERATION_ROLES}>
      <ActuatorsPage />
    </RoleGuard>
  );
}
