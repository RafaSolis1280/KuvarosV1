// DEV-38 · Une clases CSS ignorando valores vacíos: cx("a", cond && "b", undefined) → "a b".
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
