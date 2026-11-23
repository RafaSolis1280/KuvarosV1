import { describe, expect, it } from "vitest";
import { createRateLimiter } from "@/lib/contact/rateLimit";

describe("createRateLimiter (ventana deslizante)", () => {
  it("permite N envíos por ventana y bloquea el siguiente con Retry-After", () => {
    const check = createRateLimiter({ max: 3, windowMs: 60_000 });
    expect([0, 1000, 2000].map((t) => check("ip", t).allowed)).toEqual([true, true, true]);
    expect(check("ip", 3000)).toEqual({ allowed: false, retryAfterSec: 57 });
  });

  it("libera envíos a medida que salen de la ventana", () => {
    const check = createRateLimiter({ max: 2, windowMs: 10_000 });
    check("ip", 0);
    check("ip", 5000);
    expect(check("ip", 9000).allowed).toBe(false);
    expect(check("ip", 10_001).allowed).toBe(true);
  });

  it("cada visitante tiene su propio cupo", () => {
    const check = createRateLimiter({ max: 1, windowMs: 10_000 });
    expect(check("a", 0).allowed).toBe(true);
    expect(check("b", 0).allowed).toBe(true);
    expect(check("a", 1).allowed).toBe(false);
  });
});
