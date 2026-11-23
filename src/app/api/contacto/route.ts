// DEV-25 · POST /api/contacto: recibe el formulario de contacto.
// Orden: mismo origen → tamaño → límite de envíos por IP → validación (la misma del navegador) → trampa
// antispam → envío. Las respuestas de error llevan un código que el formulario traduce a un mensaje claro.
import { CONTACT } from "@/config/site";
import { validateContact } from "@/lib/contact/validation";
import { createRateLimiter } from "@/lib/contact/rateLimit";
import { getContactDelivery } from "@/lib/contact/delivery";

const checkRateLimit = createRateLimiter(CONTACT.rateLimit);

const json = (body: unknown, status: number, headers?: HeadersInit) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

/**
 * IP del visitante (primera de x-forwarded-for). En Vercel esa cabecera la pone su proxy con la IP real;
 * en un servidor propio habría que confiar solo en la del proxy, porque el cliente puede inventarla.
 */
function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "local";
}

/** Solo se aceptan envíos desde el propio sitio (si el navegador manda Origin, debe ser el mismo host) */
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return json({ error: "origen" }, 403);
  if (!request.headers.get("content-type")?.includes("application/json")) return json({ error: "formato" }, 415);

  const raw = await request.text();
  if (raw.length > CONTACT.maxBodyBytes) return json({ error: "tamano" }, 413);

  const limit = checkRateLimit(clientKey(request));
  if (!limit.allowed) return json({ error: "limite" }, 429, { "Retry-After": String(limit.retryAfterSec) });

  let input: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("no es un objeto");
    input = parsed as Record<string, unknown>;
  } catch {
    return json({ error: "formato" }, 400);
  }

  const result = validateContact(input);
  // Trampa antispam llena: se responde como si todo hubiera ido bien y no se envía nada
  if (result.isBot) return json({ ok: true }, 200);
  if (!result.ok) return json({ error: "validacion", errors: result.errors }, 422);

  const delivery = getContactDelivery();
  if (!delivery) return json({ error: "no-configurado" }, 503);
  try {
    await delivery.send(result.data);
  } catch (err) {
    console.error(`[contacto] falló el envío (${delivery.mode})`, err);
    return json({ error: "envio" }, 502);
  }
  return json({ ok: true }, 200);
}
