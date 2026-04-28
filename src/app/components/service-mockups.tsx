"use client";

import * as React from "react";
import Image from "next/image";

/**
 * Service mockups — cada serviço exibe um exemplo REAL de projeto entregue,
 * emoldurado em uma janela de browser/device com lighting e gradient framing.
 * Sem ilustração 100% vetorial — autenticidade visual de portfólio premium.
 */

type Frame = {
  src: string;
  alt: string;
  ratio?: string;
  caption?: string;
};

function BrowserFrame({ src, alt, ratio = "16/10", caption }: Frame) {
  return (
    <div className="mock-browser absolute" style={{ left: "6%", top: "10%", width: "88%", aspectRatio: ratio }}>
      <div className="mock-bar">
        <span className="mock-dot" style={{ background: "#ff5f56" }} />
        <span className="mock-dot" style={{ background: "#ffbd2e" }} />
        <span className="mock-dot" style={{ background: "#27c93f" }} />
        {caption && <span className="ml-2 text-[9px] text-gray-500 font-mono truncate">{caption}</span>}
      </div>
      <div className="relative w-full h-[calc(100%-22px)] bg-white overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}

function PhoneFrame({ src, alt, position = "right" }: Frame & { position?: "right" | "left" }) {
  const side = position === "right" ? { right: "4%" } : { left: "4%" };
  return (
    <div
      className="absolute"
      style={{ ...side, bottom: "6%", width: "26%", aspectRatio: "9/19" }}
    >
      <div className="relative w-full h-full bg-black rounded-[14px] overflow-hidden ring-2 ring-white/20 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]">
        <Image src={src} alt={alt} fill sizes="(max-width: 768px) 30vw, 180px" className="object-cover object-top" />
      </div>
    </div>
  );
}

function Glow({ tone = "rose" }: { tone?: "rose" | "emerald" | "amber" | "violet" }) {
  const colors: Record<string, string> = {
    rose: "rgba(244,63,94,0.28)",
    emerald: "rgba(16,185,129,0.24)",
    amber: "rgba(245,158,11,0.24)",
    violet: "rgba(139,92,246,0.24)",
  };
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{ background: `radial-gradient(60% 60% at 30% 30%, ${colors[tone]}, transparent 60%)` }}
    />
  );
}

/* ============ MOCKUPS ============ */

export function MockSiteInstitucional() {
  return (
    <div className="svc-mockup">
      <Glow tone="rose" />
      <BrowserFrame
        src="/images/projects/cerbelera-desktop.png"
        alt="Exemplo de site institucional — Cerbelera & Oliveira Advogados"
        caption="cerbeleraeoliveiraadv.com.br"
      />
      <PhoneFrame
        src="/images/projects/cerbelera-mobile.png"
        alt="Versão mobile do site institucional"
      />
    </div>
  );
}

export function MockLanding() {
  return (
    <div className="svc-mockup">
      <Glow tone="emerald" />
      <BrowserFrame
        src="/images/projects/bozo-desktop.png"
        alt="Exemplo de landing page de campanha — Bozo Pizzaria"
        caption="bozo.com.br"
      />
      <div
        className="absolute right-3 top-3 px-2 py-1 rounded-full text-[10px] font-mono font-semibold backdrop-blur"
        style={{ background: "rgba(16,185,129,0.25)", color: "#10b981", border: "1px solid rgba(16,185,129,0.5)" }}
      >
        +248% conv.
      </div>
    </div>
  );
}

export function MockChatbot() {
  return (
    <div className="svc-mockup">
      <Glow tone="emerald" />
      <BrowserFrame
        src="/images/projects/andresa-desktop.png"
        alt="Exemplo de site com chatbot integrado — Dra. Andresa"
        caption="draandresamartin.com.br"
      />
      <div className="absolute right-[6%] bottom-[8%] w-[44%] rounded-2xl overflow-hidden ring-1 ring-black/10 bg-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]">
        <div className="bg-emerald-500 px-3 py-2 flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-white/30 grid place-items-center text-white text-[8px] font-bold">IA</div>
          <span className="text-[10px] text-white font-semibold">Triagem 24/7</span>
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        </div>
        <div className="p-2.5 space-y-1.5 bg-gray-50">
          <div className="bg-white rounded-2xl rounded-tl-sm px-2.5 py-1.5 max-w-[85%] shadow-sm">
            <div className="text-[8px] text-gray-700 leading-tight">Olá! Como posso ajudar?</div>
          </div>
          <div className="ml-auto bg-emerald-500 rounded-2xl rounded-tr-sm px-2.5 py-1.5 max-w-[70%]">
            <div className="text-[8px] text-white leading-tight">Quero agendar consulta</div>
          </div>
          <div className="bg-white rounded-2xl rounded-tl-sm px-2.5 py-1.5 max-w-[85%] shadow-sm">
            <div className="text-[8px] text-gray-700 leading-tight">Claro! Qual especialidade?</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MockAutomation() {
  return (
    <div className="svc-mockup">
      <Glow tone="violet" />
      <BrowserFrame
        src="/images/process/code.png"
        alt="Exemplo de automação e integrações entre sistemas"
        caption="n8n · workflows"
      />
      <svg viewBox="0 0 200 40" className="absolute left-[8%] right-[8%] bottom-[10%] w-[84%] h-auto" preserveAspectRatio="xMidYMid meet" aria-hidden>
        <defs>
          <linearGradient id="flow-gradient" x1="0" x2="1">
            <stop offset="0" stopColor="#a855f7" />
            <stop offset="1" stopColor="#10b981" />
          </linearGradient>
        </defs>
        {[
          { x: 4, label: "Form" },
          { x: 46, label: "API" },
          { x: 88, label: "IA" },
          { x: 130, label: "WA" },
          { x: 172, label: "CRM" },
        ].map((n) => (
          <g key={n.label}>
            <rect x={n.x} y="14" width="24" height="14" rx="3.5" fill="rgba(255,255,255,0.95)" stroke="rgba(0,0,0,0.1)" />
            <text x={n.x + 12} y="24" fontSize="7" textAnchor="middle" fill="#0a0a0a" fontFamily="Inter" fontWeight="600">{n.label}</text>
          </g>
        ))}
        <path d="M28 21 L46 21 M70 21 L88 21 M112 21 L130 21 M154 21 L172 21" stroke="url(#flow-gradient)" strokeWidth="1.2" fill="none" strokeDasharray="3 2" />
        <circle r="1.8" fill="#f43f5e">
          <animateMotion dur="3s" repeatCount="indefinite" path="M28 21 L172 21" />
        </circle>
      </svg>
    </div>
  );
}

export function MockCRM() {
  return (
    <div className="svc-mockup">
      <Glow tone="amber" />
      <BrowserFrame
        src="/images/projects/luciana-desktop.png"
        alt="Exemplo de painel administrativo personalizado"
        caption="painel.cliente.com.br"
      />
      <div className="absolute left-[8%] bottom-[8%] right-[8%] grid grid-cols-3 gap-2">
        {[
          { v: "248", l: "leads", c: "#f43f5e" },
          { v: "R$ 48k", l: "MRR", c: "#10b981" },
          { v: "92%", l: "ativos", c: "#0a0a0a" },
        ].map((s) => (
          <div key={s.l} className="bg-white/95 backdrop-blur rounded-lg px-2 py-1.5 ring-1 ring-black/5 shadow-lg">
            <div className="text-[11px] font-bold tabular-nums leading-none" style={{ color: s.c }}>{s.v}</div>
            <div className="text-[7px] uppercase tracking-wider text-gray-500 font-mono mt-0.5">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MockBranding() {
  return (
    <div className="svc-mockup">
      <Glow tone="amber" />
      <BrowserFrame
        src="/images/process/design.png"
        alt="Exemplo de identidade visual e mockups de marca"
        caption="brand · system"
      />
      <div className="absolute left-[8%] bottom-[8%] flex gap-1.5">
        {["#f43f5e", "#f59e0b", "#10b981", "#0a0a0a", "#ffffff"].map((c) => (
          <div
            key={c}
            className="w-7 h-7 rounded-full ring-2 ring-white/30 shadow-lg"
            style={{ background: c }}
            aria-label={`Cor ${c}`}
          />
        ))}
      </div>
    </div>
  );
}

export const SERVICE_MOCKUPS: Record<string, React.FC> = {
  site: MockSiteInstitucional,
  landing: MockLanding,
  automation: MockAutomation,
  crm: MockCRM,
  chatbot: MockChatbot,
  branding: MockBranding,
};
