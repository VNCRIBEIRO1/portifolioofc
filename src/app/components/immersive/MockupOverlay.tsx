"use client";

import { useEffect } from "react";
import { CRYSTALS } from "./CrystalShowcase";
import { useImmersive } from "./store";

/**
 * MockupOverlay — Card flutuante DOM (fora do canvas) que mostra o mockup full
 * quando openedCrystal >= 0. Backdrop blur, click outside / ESC fecha.
 */
export function MockupOverlay() {
  const opened = useImmersive((s) => s.openedCrystal);
  const setOpened = useImmersive((s) => s.setOpenedCrystal);
  const setDolly = useImmersive((s) => s.setDollyTarget);

  const close = () => {
    setOpened(-1);
    setDolly(-1);
  };

  useEffect(() => {
    if (opened < 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  if (opened < 0) return null;
  const c = CRYSTALS[opened];
  if (!c) return null;

  return (
    <div
      onClick={close}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(14px) saturate(120%)",
        WebkitBackdropFilter: "blur(14px) saturate(120%)",
        background: "rgba(0, 0, 5, 0.55)",
        animation: "mockupFadeIn 320ms cubic-bezier(.2,.8,.2,1)",
        padding: "24px",
      }}
    >
      <style>{`
        @keyframes mockupFadeIn {
          from { opacity: 0; backdrop-filter: blur(0); }
          to   { opacity: 1; backdrop-filter: blur(14px); }
        }
        @keyframes mockupCardIn {
          from { opacity: 0; transform: translateY(24px) scale(.95); filter: blur(8px); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    filter: blur(0); }
        }
        @keyframes scanlines {
          0%   { background-position: 0 0; }
          100% { background-position: 0 8px; }
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          maxWidth: "min(78vw, 1280px)",
          width: "100%",
          maxHeight: "78vh",
          borderRadius: "14px",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${c.gemColor}22, #0a0a18 60%, ${c.glowColor}1a)`,
          boxShadow: `0 30px 90px -20px ${c.glowColor}55, 0 0 1px ${c.accent}88, 0 0 60px ${c.gemColor}33`,
          border: `1px solid ${c.accent}55`,
          animation: "mockupCardIn 480ms cubic-bezier(.2,.8,.2,1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 22px",
            background: "rgba(0,0,0,0.4)",
            borderBottom: `1px solid ${c.accent}33`,
            fontFamily: "ui-monospace, 'Courier New', monospace",
            fontSize: "12px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <div style={{ color: c.accent }}>
            <span style={{ opacity: 0.6 }}>{`> CASE_${opened.toString().padStart(2, "0")}`}</span>
            <span style={{ marginLeft: "12px", color: "#e8e8f0", letterSpacing: "0.05em", textTransform: "none", fontFamily: "Inter, system-ui, sans-serif", fontSize: "15px", fontWeight: 600 }}>
              {c.title}
            </span>
            <span style={{ marginLeft: "10px", opacity: 0.5 }}>· {c.nicho}</span>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Fechar"
            style={{
              background: "transparent",
              border: `1px solid ${c.accent}77`,
              color: "#e8e8f0",
              padding: "6px 12px",
              fontSize: "11px",
              letterSpacing: "0.18em",
              cursor: "pointer",
              borderRadius: "4px",
              fontFamily: "ui-monospace, 'Courier New', monospace",
            }}
          >
            FECHAR · ESC
          </button>
        </div>

        {/* Mockup imagem completa */}
        <div
          style={{
            position: "relative",
            flex: 1,
            background: "#02020a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "auto",
            padding: "20px",
          }}
        >
          {c.mockup ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={c.mockup}
              alt={`${c.title} — mockup`}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                borderRadius: "6px",
                boxShadow: `0 0 40px ${c.glowColor}55`,
                display: "block",
              }}
              draggable={false}
            />
          ) : (
            <div style={{ color: c.accent, padding: "40px", textAlign: "center" }}>
              Mockup ainda nao gerado
            </div>
          )}
          {/* Scanline overlay sutil */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 4px)",
              animation: "scanlines 8s linear infinite",
              mixBlendMode: "overlay",
            }}
          />
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 22px",
            background: "rgba(0,0,0,0.4)",
            borderTop: `1px solid ${c.accent}22`,
            fontSize: "11px",
            color: "rgba(232,232,240,0.55)",
            fontFamily: "ui-monospace, 'Courier New', monospace",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          Click fora ou ESC para retornar ao vault
        </div>
      </div>
    </div>
  );
}
