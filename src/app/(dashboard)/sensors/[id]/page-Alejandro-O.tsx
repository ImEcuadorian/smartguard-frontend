import { RoleGuard } from "@/components/auth/RoleGuard";
import { SensorDetailPage } from "@/components/sensors/SensorDetailPage";
import { AUTHENTICATED_ROLES } from "@/lib/auth/permissions";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <RoleGuard allowedRoles={AUTHENTICATED_ROLES}>
      <SensorDetailPage sensorId={id} />
    </RoleGuard>
  );
}
