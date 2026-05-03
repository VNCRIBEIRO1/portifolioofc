"use client";

import { GlitchText3D } from "./Hero3DText";

/** Manifesto 3 linhas — surge ~z=-30, some ~z=-65 */
export function Manifesto3D() {
  return (
    <group position={[0, 0, -45]}>
      <GlitchText3D position={[-3, 1.5, 0]} size={0.7} height={0.12} zStart={-25} zEnd={-65}>
        Nao fazemos sites.
      </GlitchText3D>
      <GlitchText3D position={[2, 0, -8]} size={0.7} height={0.12} zStart={-30} zEnd={-72}>
        Construimos experiencias.
      </GlitchText3D>
      <GlitchText3D position={[-1, -1.5, -16]} size={0.7} height={0.12} zStart={-40} zEnd={-80}>
        Que convertem.
      </GlitchText3D>
    </group>
  );
}

/** CTA final em ~z=-260 */
export function CTAText3D() {
  return (
    <group position={[0, 0, -260]}>
      <GlitchText3D position={[0, 0.8, 0]} size={1.0} height={0.16} zStart={-240} zEnd={-285}>
        Vamos conversar?
      </GlitchText3D>
      <GlitchText3D
        position={[0, -1.0, 0]}
        size={0.18}
        height={0.04}
        bevelSize={0.003}
        zStart={-240}
        zEnd={-285}
        letterSpacing={0.08}
      >
        SCROLL FINALIZADO   ABRA O WHATSAPP
      </GlitchText3D>
    </group>
  );
}
