// DEV-38 · Sección de video controlada por el scroll: secuencia fijada + bordes fundidos + overlays.
// Toda sección de video de la página se arma con este componente y una entrada de config/sequences.
import type { ReactNode } from "react";
import ImageSequenceCanvas from "@/components/sequence/ImageSequenceCanvas";
import SequenceEdges from "@/components/sequence/SequenceEdges";
import type { SequenceConfig } from "@/config/sequences";

interface Props {
  sequence: SequenceConfig;
  /** Descripción accesible del video */
  ariaLabel: string;
  /** Overlays que acompañan al video (fichas, specs…) */
  children?: ReactNode;
}

export default function SequenceSection({ sequence, ariaLabel, children }: Props) {
  return (
    <div className="relative stack-section">
      <ImageSequenceCanvas sequence={sequence} ariaLabel={ariaLabel}>
        <SequenceEdges />
        {children}
      </ImageSequenceCanvas>
    </div>
  );
}
