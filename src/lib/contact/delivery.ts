// DEV-25 · A dónde va el mensaje del formulario. Un solo punto para conectar el servicio real.
// ⏳ Rafael (dueño del repo y de Vercel) elige el servicio (email o WhatsApp) y carga su clave en Vercel,
//    nunca en el repo. Para conectarlo: agregar un caso en `getContactDelivery` y definir CONTACTO_ENVIO.
//
// CONTACTO_ENVIO:
// - sin definir → en desarrollo "simulado"; en producción el formulario NO se muestra (queda el CTA a Instagram).
// - "simulado"  → el envío se registra en el log del servidor (para probar una Preview sin servicio real).
import type { ContactMessage } from "@/lib/contact/validation";

export interface ContactDelivery {
  mode: string;
  send(message: ContactMessage): Promise<void>;
}

type Env = Partial<Record<string, string | undefined>>;

const simulated = (isDev: boolean): ContactDelivery => ({
  mode: "simulado",
  async send(message) {
    // En desarrollo se ve el mensaje completo; en una Preview solo un resumen (sin datos personales en los logs)
    if (isDev) console.info("[contacto] envío simulado:", message);
    else console.info(`[contacto] envío simulado: mensaje de ${message.mensaje.length} caracteres`);
  },
});

export function getContactDelivery(env: Env = process.env): ContactDelivery | null {
  const isDev = env.NODE_ENV !== "production";
  const mode = env.CONTACTO_ENVIO || (isDev ? "simulado" : "");
  switch (mode) {
    case "simulado":
      return simulated(isDev);
    // case "resend": / case "whatsapp": → lo conecta Rafael con el servicio elegido
    default:
      return null;
  }
}
