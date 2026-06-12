"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  useChangePassword,
  useCurrentUser,
} from "@/hooks/useCurrentUser";
import { canManage } from "@/lib/auth/roles";
import { formatDate } from "@/lib/utils/format-date";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { UserManagementPanel } from "@/components/users/UserManagementPanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { Input, Label } from "@/components/ui/Input";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function SettingsPage() {
  const { role, logout } = useAuth();
  const currentUser = useCurrentUser();
  const changePassword = useChangePassword();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await changePassword.mutateAsync(passwordForm);
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch {
      // React Query conserva el error para que la UI pueda seguir estable.
    }
  }

  return (
    <>
      <PageHeader
        title="Configuracion"
        description="Perfil, seguridad de sesion y parametros de conexion del frontend."
      />
      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {currentUser.isLoading ? (
              <LoadingState label="Cargando perfil" />
            ) : null}
            {currentUser.isError ? (
              <ErrorState
                tone="warning"
                title="Perfil no disponible"
                description="No se pudo cargar el usuario actual. Las demas opciones siguen disponibles."
              />
            ) : null}
            {!currentUser.isLoading && !currentUser.isError ? (
              <>
                <Info label="Usuario" value={currentUser.data?.username ?? "N/A"} />
                <Info
                  label="Nombre"
                  value={currentUser.data?.displayName ?? "Sin nombre"}
                />
                <Info
                  label="Rol"
                  value={
                    <Badge className="border-white/10 bg-white/10 text-slate-200">
                      {currentUser.data?.role ?? "N/A"}
                    </Badge>
                  }
                />
                <Info
                  label="Estado"
                  value={
                    <StatusBadge status={currentUser.data?.status ?? "INACTIVE"} />
                  }
                />
                <Info label="Creado" value={formatDate(currentUser.data?.createdAt)} />
              </>
            ) : null}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Conexion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <Info
              label="API URL"
              value={process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"}
            />
            <Info
              label="WS URL"
              value={process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8080/ws"}
            />
            <Info
              label="Sesion"
              value={
                currentUser.isLoading
                  ? "Verificando"
                  : currentUser.isError
                    ? "No verificada"
                    : currentUser.data
                      ? "Autenticada"
                      : "Sin sesion"
              }
            />
            <div className="pt-2">
              <Button type="button" variant="danger" onClick={() => void logout()}>
                Cerrar sesion
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Apariencia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-[360px_1fr] md:items-center">
              <ThemeSwitcher />
              <p className="text-sm leading-6 text-slate-400">
                Cambia el color principal, acentos, glows y estados activos de
                la consola. La preferencia se guarda localmente en este equipo.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Cambiar contrasena</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-4 md:grid-cols-[1fr_1fr_auto]"
              onSubmit={handlePasswordSubmit}
            >
              <div>
                <Label htmlFor="current-password">Contrasena actual</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(event) =>
                    setPasswordForm((current) => ({
                      ...current,
                      currentPassword: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="new-password">Nueva contrasena</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(event) =>
                    setPasswordForm((current) => ({
                      ...current,
                      newPassword: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="flex items-end">
                <Button type="submit" isLoading={changePassword.isPending}>
                  Actualizar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        {canManage(role) ? <UserManagementPanel /> : null}
      </section>
    </>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0">
      <span className="text-slate-400">{label}</span>
      <span className="text-right font-medium text-slate-100">{value}</span>
    </div>
  );
}
