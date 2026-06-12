import { RoleGuard } from "@/components/auth/RoleGuard";
import { DeviceDetailPage } from "@/components/devices/DeviceDetailPage";
import { AUTHENTICATED_ROLES } from "@/lib/auth/permissions";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <RoleGuard allowedRoles={AUTHENTICATED_ROLES}>
      <DeviceDetailPage deviceId={id} />
    </RoleGuard>
  );
}
