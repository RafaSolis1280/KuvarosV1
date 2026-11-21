// Sección 2 · Video 1: la hamburguesa se separa capa por capa y aparece la ficha de cada ingrediente
// (DEV-09 + DEV-19).
import SequenceSection from "@/components/sequence/SequenceSection";
import IngredientCallouts from "@/components/dom/IngredientCallouts";
import { SEQUENCES } from "@/config/sequences";
import { PRODUCTO } from "@/content/producto";

export default function IngredientsSection() {
  const sequence = SEQUENCES.hamburguesa;
  return (
    <SequenceSection sequence={sequence} ariaLabel={PRODUCTO.secuenciaAria}>
      <IngredientCallouts
        sequenceId={sequence.id}
        ingredientes={PRODUCTO.ingredientes}
        ariaLabel={PRODUCTO.accesibilidad.listaIngredientes}
      />
    </SequenceSection>
  );
}
