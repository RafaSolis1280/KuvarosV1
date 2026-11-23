"use client";

// DEV-25 · Formulario de contacto accesible.
// - Valida en el navegador con la MISMA función que usa el servidor (lib/contact/validation).
// - Cada campo con error muestra su mensaje (aria-invalid + aria-describedby) y el foco salta al primero.
// - Una región aria-live anuncia el resumen de errores y el resultado del envío.
// - Campo trampa invisible contra bots; el servidor además limita los envíos por IP.
// El estado de React solo cambia al enviar o al salir de un campo, nunca por frame ni por scroll.
import { useEffect, useRef, useState, type FocusEvent, type FormEvent } from "react";
import { ctaClassName } from "@/components/ui/CtaLink";
import { CONTACT } from "@/config/site";
import { SITIO } from "@/content/sitio";
import {
  CONTACT_FIELDS,
  firstInvalidField,
  validateContact,
  type ContactErrors,
  type ContactField,
} from "@/lib/contact/validation";
import { cx } from "@/lib/cx";

type Status = "idle" | "sending" | "sent" | "limit" | "unavailable" | "error";

const FIELD_CLASS =
  "mt-2 w-full rounded-xl border border-ink/20 bg-surface px-4 py-3 text-base text-ink transition-colors focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-[invalid=true]:border-red-300";

export default function ContactForm() {
  const t = SITIO.contacto;
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [announcement, setAnnouncement] = useState("");
  /** Tras el primer intento de envío, cada campo se revalida al salir de él */
  const [attempted, setAttempted] = useState(false);
  /** Se enfoca el primer error DESPUÉS de pintar su mensaje, para que el lector lo lea con el campo */
  const pendingFocus = useRef(false);

  useEffect(() => {
    if (!pendingFocus.current) return;
    pendingFocus.current = false;
    const first = firstInvalidField(errors);
    const el = first ? formRef.current?.elements.namedItem(first) : null;
    if (el instanceof HTMLElement) el.focus();
  }, [errors]);

  const readForm = () => Object.fromEntries(new FormData(formRef.current ?? undefined)) as Record<string, unknown>;

  const showErrors = (next: ContactErrors) => {
    const invalid = CONTACT_FIELDS.filter((field) => next[field]).map((field) => t.campos[field].label);
    pendingFocus.current = true;
    setErrors(next);
    setStatus("idle");
    setAnnouncement(t.resumenErrores(invalid));
  };

  /** Un solo manejador para todos los campos (el evento blur sube hasta el formulario en React) */
  const onFieldBlur = (event: FocusEvent<HTMLFormElement>) => {
    const target = event.target as EventTarget;
    const field = (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement ? target.name : "") as ContactField;
    if (!attempted || !CONTACT_FIELDS.includes(field)) return;
    const result = validateContact(readForm());
    setErrors((prev) => ({ ...prev, [field]: result.ok ? undefined : result.errors[field] }));
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    setAttempted(true);

    const input = readForm();
    const result = validateContact(input);
    if (!result.ok) return showErrors(result.errors);

    setErrors({});
    setStatus("sending");
    setAnnouncement(t.enviando);
    try {
      const response = await fetch(CONTACT.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (response.ok) {
        formRef.current?.reset();
        setAttempted(false);
        setStatus("sent");
        setAnnouncement(t.estados.enviado);
        return;
      }
      const body = (await response.json().catch(() => ({}))) as { errors?: ContactErrors };
      if (response.status === 422 && body.errors) return showErrors(body.errors);
      const next: Status = response.status === 429 ? "limit" : response.status === 503 ? "unavailable" : "error";
      setStatus(next);
      setAnnouncement(next === "limit" ? t.estados.limite : next === "unavailable" ? t.estados.noDisponible : t.estados.error);
    } catch {
      setStatus("error");
      setAnnouncement(t.estados.error);
    }
  }

  const fieldProps = (field: ContactField) => ({
    id: `contacto-${field}`,
    name: field,
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `contacto-${field}-error` : undefined,
    className: FIELD_CLASS,
  });

  const errorText = (field: ContactField) =>
    errors[field] ? (
      <p id={`contacto-${field}-error`} className="mt-2 text-sm text-red-300">
        {errors[field]}
      </p>
    ) : null;

  const { campos } = t;
  const failed = status === "limit" || status === "unavailable" || status === "error" || Object.keys(errors).some((k) => errors[k as ContactField]);

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} onBlur={onFieldBlur} className="space-y-5 text-left">
      <div>
        <label htmlFor="contacto-nombre" className="block text-sm font-semibold">
          {campos.nombre.label}
        </label>
        <input type="text" autoComplete={campos.nombre.autocomplete} required {...fieldProps("nombre")} />
        {errorText("nombre")}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contacto-email" className="block text-sm font-semibold">
            {campos.email.label}
          </label>
          <input type="email" inputMode="email" autoComplete={campos.email.autocomplete} required {...fieldProps("email")} />
          {errorText("email")}
        </div>
        <div>
          <label htmlFor="contacto-telefono" className="block text-sm font-semibold">
            {campos.telefono.label}
          </label>
          <input type="tel" inputMode="tel" autoComplete={campos.telefono.autocomplete} {...fieldProps("telefono")} />
          {errorText("telefono")}
        </div>
      </div>

      <div>
        <label htmlFor="contacto-mensaje" className="block text-sm font-semibold">
          {campos.mensaje.label}
        </label>
        <textarea rows={4} required maxLength={CONTACT.fields.mensaje.max} {...fieldProps("mensaje")} />
        {errorText("mensaje")}
      </div>

      {/* Trampa antispam: invisible y fuera del orden de Tab; una persona nunca la completa */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`contacto-${CONTACT.honeypot}`}>{t.trampa}</label>
        <input id={`contacto-${CONTACT.honeypot}`} name={CONTACT.honeypot} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "sending"}
          className={ctaClassName("lg", "disabled:cursor-wait disabled:opacity-70")}
        >
          {status === "sending" ? t.enviando : t.boton}
        </button>
        <p
          role="status"
          aria-live="polite"
          className={cx("text-sm", failed ? "text-red-300" : "text-ink")}
        >
          {announcement}
        </p>
      </div>
    </form>
  );
}
