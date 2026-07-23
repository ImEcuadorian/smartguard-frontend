"use client";

import { Eye, EyeOff, LogOut, Save, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useChangePassword } from "@/hooks/useCurrentUser";
import type { UserAccountResponse } from "@/lib/api/types";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Input";

interface ProfileFormState {
  displayName: string;
  username: string;
  phone: string;
  restaurantName: string;
  address: string;
}

export function ProfileForm({
  user,
  onLogout,
}: {
  user: UserAccountResponse;
  onLogout: () => void;
}) {
  const changePassword = useChangePassword();
  const [profileForm, setProfileForm] = useState<ProfileFormState>(() =>
    buildInitialProfile(user),
  );
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [profileNotice, setProfileNotice] = useState<string | null>(null);
  const [passwordNotice, setPasswordNotice] = useState<string | null>(null);

  function updateProfileField(field: keyof ProfileFormState, value: string) {
    setProfileNotice(null);
    setProfileForm((current) => ({ ...current, [field]: value }));
  }

  function resetProfileForm() {
    setProfileForm(buildInitialProfile(user));
    setProfileNotice("Cambios descartados.");
  }

  async function submitPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordNotice(null);

    try {
      await changePassword.mutateAsync({
        currentPassword,
        newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setPasswordNotice("Contrasena actualizada correctamente.");
    } catch {
      setPasswordNotice("No se pudo actualizar la contrasena. Verifica los datos.");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <Card className="overflow-hidden">
        <CardHeader className="bg-white/[0.025]">
          <CardTitle>Editar perfil</CardTitle>
          <p className="mt-1 text-sm text-slate-400">
            Datos visuales preparados para el perfil del restaurante.
          </p>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              setProfileNotice(
                "La edicion de perfil estara disponible cuando el backend habilite este endpoint.",
              );
            }}
          >
            <div>
              <Label htmlFor="profile-display-name">Nombre completo</Label>
              <Input
                id="profile-display-name"
                value={profileForm.displayName}
                onChange={(event) =>
                  updateProfileField("displayName", event.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="profile-username">Correo electronico o usuario</Label>
              <Input
                id="profile-username"
                value={profileForm.username}
                onChange={(event) => updateProfileField("username", event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="profile-phone">Telefono opcional</Label>
              <Input
                id="profile-phone"
                placeholder="+593 99 123 4567"
                value={profileForm.phone}
                onChange={(event) => updateProfileField("phone", event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="profile-restaurant">Nombre del restaurante</Label>
              <Input
                id="profile-restaurant"
                placeholder="Restaurante demo"
                value={profileForm.restaurantName}
                onChange={(event) =>
                  updateProfileField("restaurantName", event.target.value)
                }
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="profile-address">Direccion opcional</Label>
              <Input
                id="profile-address"
                placeholder="Direccion del restaurante"
                value={profileForm.address}
                onChange={(event) => updateProfileField("address", event.target.value)}
              />
            </div>

            {profileNotice ? (
              <div className="md:col-span-2 rounded-lg border border-amber-300/25 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                {profileNotice}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3 md:col-span-2">
              <Button type="submit">
                <Save className="h-4 w-4" />
                Guardar cambios
              </Button>
              <Button type="button" variant="secondary" onClick={resetProfileForm}>
                <X className="h-4 w-4" />
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader className="bg-white/[0.025]">
            <CardTitle>Cambiar contrasena</CardTitle>
            <p className="mt-1 text-sm text-slate-400">
              Usa el endpoint protegido existente de SmartGuard 360.
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={submitPassword}>
              <PasswordField
                id="profile-current-password"
                label="Contrasena actual"
                value={currentPassword}
                show={showCurrentPassword}
                onToggle={() => setShowCurrentPassword((current) => !current)}
                onChange={setCurrentPassword}
                autoComplete="current-password"
              />
              <PasswordField
                id="profile-new-password"
                label="Nueva contrasena"
                value={newPassword}
                show={showNewPassword}
                onToggle={() => setShowNewPassword((current) => !current)}
                onChange={setNewPassword}
                autoComplete="new-password"
              />

              {passwordNotice ? (
                <div className="rounded-lg border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-slate-300">
                  {passwordNotice}
                </div>
              ) : null}

              <Button
                type="submit"
                className="w-full"
                isLoading={changePassword.isPending}
              >
                Actualizar contrasena
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-white/[0.025]">
            <CardTitle>Sesion</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-slate-400">
              Cierra la sesion cuando termines de revisar tu cocina o tus
              dispositivos.
            </p>
            <Button
              type="button"
              variant="danger"
              className="mt-4 w-full"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesion
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  show,
  onToggle,
  onChange,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  show: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
  autoComplete: string;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          className="pr-12"
          required
        />
        <button
          type="button"
          aria-label={show ? "Ocultar contrasena" : "Mostrar contrasena"}
          onClick={onToggle}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-white/10 hover:text-[var(--sg-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sg-primary)]"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

function buildInitialProfile(user: UserAccountResponse): ProfileFormState {
  return {
    displayName: user.displayName ?? "",
    username: user.username ?? "",
    phone: "",
    restaurantName: "",
    address: "",
  };
}
