// Secciones 2-3 · La historia del producto en video (DEV-40): UNA sola sección fijada en la que la
// hamburguesa se separa capa por capa con la ficha de cada ingrediente, se vuelve a armar y entra a la
// bolsa mientras se completa la ficha del packaging. Sin cortes entre los dos clips del master.
// Los tramos de cada overlay salen de los beats (config/sequences.ts): cambiar el ritmo no exige
// tocar los componentes.
import SequenceSection from "@/components/sequence/SequenceSection";
import IngredientCallouts from "@/components/dom/IngredientCallouts";
import PackagingSpecs from "@/components/dom/PackagingSpecs";
import StoryProgress from "@/components/dom/StoryProgress";
import { PRODUCT_STORY } from "@/config/sequences";
import { REVEAL } from "@/config/motion";
import { beatRanges } from "@/lib/sequence/timeline";
import { PRODUCTO } from "@/content/producto";

export default function ProductStorySection() {
  const story = PRODUCT_STORY;
  const beats = beatRanges(story.beats);
  const { historia, ingredientes, packaging, accesibilidad } = PRODUCTO;

  // La ficha del packaging entra mientras la hamburguesa va a la bolsa y se completa mientras entra
  const [bagStart, bagEnd] = beats["a-la-bolsa"];
  const panelEntry = bagStart + (bagEnd - bagStart) * REVEAL.specs.panelEntryShare;
  const specsRange = [beats["sobre-la-bolsa"][0], beats["adentro"][1]] as const;
  // En el último beat la ficha se va y queda solo la bolsa cerrada con el logo (plano final de marca)
  const [logoStart, logoEnd] = beats["logo"];
  const panelExit = logoStart + (logoEnd - logoStart) * REVEAL.specs.panelExitShare;

  const chapters = historia.capitulos.map((c) => ({
    numero: c.numero,
    titulo: c.titulo,
    range: [beats[c.desde][0], beats[c.hasta][1]] as const,
  }));

  return (
    <SequenceSection sequence={story} ariaLabel={historia.secuenciaAria}>
      <IngredientCallouts
        sequenceId={story.id}
        ingredientes={ingredientes}
        range={beats["ingredientes"]}
        ariaLabel={accesibilidad.listaIngredientes}
      />
      {/* El producto queda a la izquierda del encuadre de la bolsa: la ficha va a la derecha */}
      <div className="absolute inset-0">
        <PackagingSpecs
          sequenceId={story.id}
          content={packaging}
          entrada={panelEntry}
          salida={panelExit}
          tramoSpecs={specsRange}
          lado="derecha"
        />
      </div>
      <StoryProgress sequenceId={story.id} chapters={chapters} />
    </SequenceSection>
  );
}
