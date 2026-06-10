"use client";

import { Clipboard } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export function DeviceApiKeyModal({
  apiKey,
  open,
  onClose,
}: {
  apiKey: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function copyApiKey() {
    if (!apiKey) return;
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
  }

  return (
    <Modal open={open} title="API key del dispositivo" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm leading-6 text-slate-400">
          Esta clave se muestra una sola vez. Copiala para configurar el ESP32.
        </p>
        <div className="rounded-md border border-amber-300/30 bg-amber-400/10 p-3 font-mono text-sm text-amber-100">
          {apiKey}
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={copyApiKey}>
            <Clipboard className="h-4 w-4" />
            {copied ? "Copiada" : "Copiar"}
          </Button>
          <Button type="button" onClick={onClose}>
            Entendido
          </Button>
        </div>
      </div>
    </Modal>
  );
}
