import { describe, expect, it } from "vitest";
import { resolveSiteUrl } from "@/config/site";
import { PRODUCTO } from "@/content/producto";
import {
  SEO_LIMITS,
  createBusinessJsonLd,
  createRobots,
  createSiteMetadata,
  createSitemap,
  serializeJsonLd,
} from "@/lib/seo";

describe("resolveSiteUrl (canónica, OG, sitemap)", () => {
  it("prioriza el dominio oficial, luego el de producción de Vercel y luego el del deploy", () => {
    const env = { NEXT_PUBLIC_SITE_URL: "https://kuvaros.bo", VERCEL_PROJECT_PRODUCTION_URL: "k.vercel.app", VERCEL_URL: "k-123.vercel.app" };
    expect(resolveSiteUrl(env)).toBe("https://kuvaros.bo");
    expect(resolveSiteUrl({ ...env, NEXT_PUBLIC_SITE_URL: "" })).toBe("https://k.vercel.app");
    expect(resolveSiteUrl({ VERCEL_URL: "k-123.vercel.app" })).toBe("https://k-123.vercel.app");
  });
  it("sin variables usa localhost y nunca deja una «/» final", () => {
    expect(resolveSiteUrl({})).toBe("http://localhost:3000");
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://kuvaros.bo/" })).toBe("https://kuvaros.bo");
  });
});

describe("metadatos", () => {
  it("título ≤ 60 y descripción ≤ 155 caracteres", () => {
    expect(PRODUCTO.seo.titulo.length).toBeLessThanOrEqual(SEO_LIMITS.title);
    expect(PRODUCTO.seo.descripcion.length).toBeLessThanOrEqual(SEO_LIMITS.description);
  });
  it("tiene canónica, Open Graph con imagen 1200×630 y tarjeta de Twitter", () => {
    const meta = createSiteMetadata();
    expect(meta.alternates?.canonical).toBe("/");
    expect(meta.openGraph?.images).toEqual([expect.objectContaining({ url: "/og-image.jpg", width: 1200, height: 630 })]);
    expect(meta.twitter).toEqual(expect.objectContaining({ card: "summary_large_image" }));
  });
});

describe("JSON-LD del negocio", () => {
  const data = createBusinessJsonLd("https://kuvaros.bo");
  const [restaurant, website] = data["@graph"];

  it("Restaurant con nombre, URL e imagen absolutas, dirección y redes", () => {
    expect(restaurant["@type"]).toBe("Restaurant");
    expect(restaurant.name).toBe("Kuvaro's Smash Burguers");
    expect(restaurant.url).toBe("https://kuvaros.bo/");
    expect(restaurant.image).toBe("https://kuvaros.bo/og-image.jpg");
    expect(restaurant.address).toEqual(expect.objectContaining({ "@type": "PostalAddress", addressCountry: "BO" }));
    expect(restaurant.sameAs).toContain(PRODUCTO.instagram.url);
  });
  it("el WebSite apunta al negocio como editor", () => {
    expect(website.publisher).toEqual({ "@id": restaurant["@id"] });
  });
  it("al serializar no puede cerrar el <script> (escapa «<»)", () => {
    const json = serializeJsonLd({ texto: "</script><script>alert(1)</script>" });
    expect(json).not.toContain("<");
    expect(JSON.parse(json).texto).toBe("</script><script>alert(1)</script>");
  });
});

describe("sitemap y robots", () => {
  it("el sitemap tiene la home absoluta y robots apunta a él", () => {
    expect(createSitemap("https://kuvaros.bo")).toEqual([expect.objectContaining({ url: "https://kuvaros.bo/" })]);
    const robots = createRobots("https://kuvaros.bo");
    expect(robots.sitemap).toBe("https://kuvaros.bo/sitemap.xml");
    expect(robots.rules).toEqual(expect.objectContaining({ allow: "/", disallow: "/api/" }));
  });
});
