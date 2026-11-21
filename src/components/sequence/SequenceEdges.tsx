// Funde los bordes del video (fondo negro puro con viñeta) con el Negro Profundo de la página.
export default function SequenceEdges() {
  return (
    <>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-surface to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-surface to-transparent" />
    </>
  );
}
