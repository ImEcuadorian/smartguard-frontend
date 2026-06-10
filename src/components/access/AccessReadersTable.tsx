import type { AccessReaderResponse } from "@/lib/api/types";
import { DataTable, Td, Th } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function AccessReadersTable({
  readers,
}: {
  readers: AccessReaderResponse[];
}) {
  if (!readers.length) {
    return (
      <EmptyState
        title="Sin lectores"
        description="No hay lectores RFID/NFC registrados."
      />
    );
  }

  return (
    <DataTable>
      <thead>
        <tr>
          <Th>Codigo</Th>
          <Th>Tipo</Th>
          <Th>Estado</Th>
          <Th>Dispositivo</Th>
          <Th>Ubicacion</Th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/10">
        {readers.map((reader) => (
          <tr key={reader.id}>
            <Td className="font-mono text-xs">{reader.code}</Td>
            <Td>{reader.type}</Td>
            <Td>
              <StatusBadge status={reader.status} />
            </Td>
            <Td className="font-mono text-xs">{reader.deviceId}</Td>
            <Td>{reader.location ?? "Sin ubicacion"}</Td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}
