// Sección 3 · Video 2: la hamburguesa y las papas entran a la bolsa y se completa la ficha del
// packaging (DEV-37).
import SequenceSection from "@/components/sequence/SequenceSection";
import PackagingSpecs from "@/components/dom/PackagingSpecs";
import { SEQUENCES } from "@/config/sequences";
import { PRODUCTO } from "@/content/producto";

export default function PackagingSection() {
  const sequence = SEQUENCES.packaging;
  const { secuenciaAria, ...content } = PRODUCTO.packaging;
  return (
    <SequenceSection sequence={sequence} ariaLabel={secuenciaAria}>
      {/* El producto queda a la izquierda del encuadre: la ficha va a la derecha */}
      <PackagingSpecs sequenceId={sequence.id} content={content} lado="derecha" />
    </SequenceSection>
  );
}
