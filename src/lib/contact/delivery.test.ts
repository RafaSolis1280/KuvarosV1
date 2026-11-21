import { describe, expect, it } from "vitest";
import { getContactDelivery } from "@/lib/contact/delivery";

describe("getContactDelivery", () => {
  it("en desarrollo simula el envío aunque no haya servicio", () => {
    expect(getContactDelivery({ NODE_ENV: "development" })?.mode).toBe("simulado");
  });
  it("en producción sin servicio devuelve null (el formulario no se muestra)", () => {
    expect(getContactDelivery({ NODE_ENV: "production" })).toBeNull();
  });
  it("CONTACTO_ENVIO=simulado lo activa en una Preview; un modo desconocido no", () => {
    expect(getContactDelivery({ NODE_ENV: "production", CONTACTO_ENVIO: "simulado" })?.mode).toBe("simulado");
    expect(getContactDelivery({ NODE_ENV: "production", CONTACTO_ENVIO: "otro" })).toBeNull();
  });
});
