import { SensorDetailPage } from "@/components/sensors/SensorDetailPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <SensorDetailPage sensorId={id} />;
}
