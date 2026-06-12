"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  useCreateUser,
  useUpdateUserStatus,
  useUsers,
} from "@/hooks/useCurrentUser";
import type { UserRole, UserStatus } from "@/lib/api/types";
import { canManage } from "@/lib/auth/roles";
import { formatDate } from "@/lib/utils/format-date";
import { AccessRestricted } from "@/components/auth/AccessRestricted";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { DataTable, Td, Th } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Input } from "@/components/ui/Input";
import { LoadingState } from "@/components/ui/LoadingState";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/Badge";

export function UserManagementPanel() {
  const { role } = useAuth();
  const users = useUsers(canManage(role));
  const createUser = useCreateUser();
  const updateUserStatus = useUpdateUserStatus();
  const [userForm, setUserForm] = useState({
    username: "",
    displayName: "",
    password: "",
    role: "VIEWER" as UserRole,
  });

  async function handleCreateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await createUser.mutateAsync(userForm);
      setUserForm({
        username: "",
        displayName: "",
        password: "",
        role: "VIEWER",
      });
    } catch {
      // React Query conserva el error para que la UI pueda seguir estable.
    }
  }

  if (!canManage(role)) {
    return (
      <AccessRestricted description="Solo un administrador puede gestionar clientes, usuarios y estados de cuenta." />
    );
  }

  return (
    <Card className="xl:col-span-2">
      <CardHeader>
        <CardTitle>Clientes / Usuarios</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <form
          className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_160px_auto]"
          onSubmit={handleCreateUser}
        >
          <Input
            placeholder="Usuario"
            value={userForm.username}
            onChange={(event) =>
              setUserForm((current) => ({
                ...current,
                username: event.target.value,
              }))
            }
            required
          />
          <Input
            placeholder="Nombre"
            value={userForm.displayName}
            onChange={(event) =>
              setUserForm((current) => ({
                ...current,
                displayName: event.target.value,
              }))
            }
            required
          />
          <Input
            placeholder="Contrasena"
            type="password"
            value={userForm.password}
            onChange={(event) =>
              setUserForm((current) => ({
                ...current,
                password: event.target.value,
              }))
            }
            required
          />
          <Select
            value={userForm.role}
            onChange={(event) =>
              setUserForm((current) => ({
                ...current,
                role: event.target.value as UserRole,
              }))
            }
          >
            <option value="VIEWER">CLIENTE</option>
            <option value="OPERATOR">OPERATOR</option>
            <option value="ADMIN">ADMIN</option>
          </Select>
          <Button type="submit" isLoading={createUser.isPending}>
            Crear
          </Button>
        </form>

        {users.isLoading ? <LoadingState label="Cargando usuarios" /> : null}
        {users.isError ? (
          <ErrorState
            tone="warning"
            title="Usuarios no disponibles"
            description="No se pudo cargar la lista de usuarios. El resto de la configuracion sigue visible."
          />
        ) : null}
        {!users.isLoading && !users.isError && users.data?.length ? (
          <DataTable>
            <thead>
              <tr>
                <Th>Usuario</Th>
                <Th>Nombre</Th>
                <Th>Rol</Th>
                <Th>Estado</Th>
                <Th>Actualizado</Th>
                <Th>Acciones</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.data.map((user) => (
                <tr key={user.id}>
                  <Td className="font-medium text-slate-100">{user.username}</Td>
                  <Td>{user.displayName}</Td>
                  <Td>
                    <Badge className="border-white/10 bg-white/10 text-slate-200">
                      {user.role === "VIEWER" ? "CLIENTE" : user.role}
                    </Badge>
                  </Td>
                  <Td>
                    <StatusBadge status={user.status} />
                  </Td>
                  <Td>{formatDate(user.updatedAt)}</Td>
                  <Td>
                    <Select
                      value={user.status}
                      onChange={(event) =>
                        updateUserStatus.mutate({
                          id: user.id,
                          status: event.target.value as UserStatus,
                        })
                      }
                      className="max-w-36"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="DISABLED">DISABLED</option>
                    </Select>
                  </Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        ) : null}
        {!users.isLoading && !users.isError && !users.data?.length ? (
          <EmptyState
            title="Sin clientes"
            description="Crea una cuenta VIEWER para registrar el primer cliente visual del sistema."
          />
        ) : null}
      </CardContent>
    </Card>
  );
}
