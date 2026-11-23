// DEV-25 · El route handler de punta a punta (validación de servidor, límite, trampa, origen y formato).
import { describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/contacto/route";

let ipCounter = 0;
const valid = { nombre: "Ana", email: "ana@correo.com", telefono: "", mensaje: "Hola, quiero hacer un pedido." };

function post(body: unknown, { ip = `10.0.0.${++ipCounter}`, headers = {} as Record<string, string> } = {}) {
  return POST(
    new Request("http://localhost:3000/api/contacto", {
      method: "POST",
      headers: { "content-type": "application/json", host: "localhost:3000", "x-forwarded-for": ip, ...headers },
      body: typeof body === "string" ? body : JSON.stringify(body),
    })
  );
}

describe("POST /api/contacto", () => {
  vi.spyOn(console, "info").mockImplementation(() => {});

  it("acepta un mensaje válido (envío simulado fuera de producción)", async () => {
    const res = await post(valid);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("valida también en el servidor y devuelve el error de cada campo (422)", async () => {
    const res = await post({ ...valid, email: "mal", mensaje: "" });
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(Object.keys(body.errors)).toEqual(["email", "mensaje"]);
  });

  it("limita los envíos seguidos desde la misma IP (429 + Retry-After)", async () => {
    const statuses = [];
    for (let i = 0; i < 4; i++) statuses.push((await post(valid, { ip: "10.9.9.9" })).status);
    expect(statuses).toEqual([200, 200, 200, 429]);
    const blocked = await post(valid, { ip: "10.9.9.9" });
    expect(Number(blocked.headers.get("retry-after"))).toBeGreaterThan(0);
  });

  it("descarta en silencio lo que llena el campo trampa", async () => {
    const info = vi.spyOn(console, "info");
    info.mockClear();
    const res = await post({ ...valid, sitio_web: "spam" });
    expect(res.status).toBe(200);
    expect(info).not.toHaveBeenCalled();
  });

  it("rechaza otro origen, otro formato y cuerpos enormes", async () => {
    expect((await post(valid, { headers: { origin: "https://otro-sitio.com" } })).status).toBe(403);
    expect((await post(valid, { headers: { "content-type": "text/plain" } })).status).toBe(415);
    expect((await post("{no es json")).status).toBe(400);
    expect((await post({ ...valid, mensaje: "x".repeat(10_000) })).status).toBe(413);
  });
});
