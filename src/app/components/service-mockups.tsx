"use client";

import * as React from "react";

/* Each mockup uses .svc-mockup as wrapper. Pure CSS/SVG, no images. */

export function MockSiteInstitucional() {
  return (
    <div className="svc-mockup">
      <div className="mock-window absolute" style={{ left: "8%", top: "12%", width: "78%", aspectRatio: "16/10" }}>
        <div className="mock-bar">
          <span className="mock-dot" style={{ background: "#ff5f56" }} />
          <span className="mock-dot" style={{ background: "#ffbd2e" }} />
          <span className="mock-dot" style={{ background: "#27c93f" }} />
          <span className="ml-2 text-[8px] text-gray-400">site.com.br</span>
        </div>
        <div className="p-3">
          <div className="flex justify-between mb-2">
            <div className="h-2 w-12 rounded bg-gray-900" />
            <div className="flex gap-1">
              {[1,2,3,4].map(i => <div key={i} className="h-1.5 w-5 rounded bg-gray-300" />)}
            </div>
          </div>
          <div className="h-3 w-32 rounded bg-gray-900 mb-1" />
          <div className="h-1.5 w-40 rounded bg-rose-400 mb-2" />
          <div className="h-1 w-44 rounded bg-gray-200 mb-1" />
          <div className="h-1 w-36 rounded bg-gray-200 mb-3" />
          <div className="flex gap-2">
            <div className="h-4 w-14 rounded-full bg-rose-500" />
            <div className="h-4 w-12 rounded-full bg-gray-100 border border-gray-200" />
          </div>
        </div>
      </div>
      <div className="mock-window absolute" style={{ right: "6%", bottom: "10%", width: "32%", aspectRatio: "9/16" }}>
        <div className="p-1.5">
          <div className="h-1.5 w-10 rounded bg-gray-900 mb-1" />
          <div className="h-6 rounded bg-gradient-to-br from-rose-300 to-amber-300 mb-1" />
          <div className="h-1 w-full rounded bg-gray-200 mb-0.5" />
          <div className="h-1 w-3/4 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export function MockLanding() {
  return (
    <div className="svc-mockup">
      <div className="mock-window absolute" style={{ left: "10%", top: "14%", width: "80%", aspectRatio: "16/10" }}>
        <div className="p-4 text-center">
          <div className="mock-pill mb-2 inline-block">PROMO</div>
          <div className="h-3 w-44 rounded bg-gray-900 mx-auto mb-1" />
          <div className="h-3 w-32 rounded bg-rose-500 mx-auto mb-2" />
          <div className="h-1 w-52 rounded bg-gray-200 mx-auto mb-1" />
          <div className="h-1 w-44 rounded bg-gray-200 mx-auto mb-3" />
          <div className="h-5 w-24 rounded-full bg-emerald-500 mx-auto" />
        </div>
      </div>
      <div className="absolute right-3 top-3 mock-pill" style={{ background: "rgba(16,185,129,0.2)", color: "#10b981" }}>+248% conv.</div>
    </div>
  );
}

export function MockAutomation() {
  return (
    <div className="svc-mockup">
      <svg viewBox="0 0 200 120" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="flow" x1="0" x2="1">
            <stop offset="0" stopColor="#f43f5e" />
            <stop offset="1" stopColor="#10b981" />
          </linearGradient>
        </defs>
        {[
          { x: 18, y: 30, label: "Form" },
          { x: 78, y: 18, label: "API" },
          { x: 78, y: 60, label: "AI" },
          { x: 138, y: 30, label: "WA" },
          { x: 138, y: 80, label: "CRM" },
        ].map((n, i) => (
          <g key={i}>
            <rect x={n.x} y={n.y} width="34" height="20" rx="6" fill="#fff" />
            <text x={n.x + 17} y={n.y + 13} fontSize="8" textAnchor="middle" fill="#0a0a0a" fontFamily="Inter" fontWeight="600">{n.label}</text>
          </g>
        ))}
        <path d="M52 40 Q 65 28, 78 28 M52 40 Q 65 60, 78 70 M112 28 Q 125 30, 138 40 M112 70 Q 125 75, 138 90" stroke="url(#flow)" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
        <circle cx="112" cy="28" r="2" fill="#f43f5e">
          <animate attributeName="cx" from="78" to="138" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}

export function MockCRM() {
  return (
    <div className="svc-mockup">
      <div className="mock-window absolute" style={{ left: "6%", top: "10%", width: "88%", height: "82%" }}>
        <div className="mock-bar">
          <div className="h-1.5 w-1.5 rounded bg-rose-500" />
          <span className="text-[8px] text-gray-700 font-semibold">/dashboard</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 p-2">
          {[
            { v: "248", l: "leads", c: "text-rose-500" },
            { v: "R$48k", l: "MRR", c: "text-emerald-600" },
            { v: "92%", l: "ativos", c: "text-gray-900" },
          ].map((s, i) => (
            <div key={i} className="mock-stat">
              <div className={`text-[10px] font-bold ${s.c}`}>{s.v}</div>
              <div className="text-[7px] uppercase tracking-wider text-gray-400">{s.l}</div>
            </div>
          ))}
        </div>
        <div className="px-2 pb-2">
          <div className="mock-bar-chart">
            {[18,32,28,45,38,52,60,42,55,68,72,80].map((h,i)=>(<span key={i} style={{ height: `${h}%` }} />))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MockChatbot() {
  return (
    <div className="svc-mockup">
      <div className="mock-window absolute" style={{ right: "6%", bottom: "8%", width: "62%", height: "82%" }}>
        <div className="bg-emerald-500 px-2 py-1.5 flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-white/30" />
          <span className="text-[8px] text-white font-semibold">Triagem IA</span>
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        </div>
        <div className="p-2 space-y-1.5">
          <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-2 py-1 max-w-[70%]">
            <div className="h-1 w-16 rounded bg-gray-400 mb-0.5" />
            <div className="h-1 w-12 rounded bg-gray-400" />
          </div>
          <div className="ml-auto bg-emerald-500 rounded-2xl rounded-tr-sm px-2 py-1 max-w-[60%]">
            <div className="h-1 w-12 rounded bg-white/80" />
          </div>
          <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-2 py-1 max-w-[80%]">
            <div className="h-1 w-20 rounded bg-gray-400 mb-0.5" />
            <div className="h-1 w-14 rounded bg-gray-400 mb-0.5" />
            <div className="h-1 w-10 rounded bg-gray-400" />
          </div>
          <div className="flex gap-1 pt-1">
            <div className="h-3 w-10 rounded-full bg-emerald-500" />
            <div className="h-3 w-10 rounded-full border border-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MockBranding() {
  return (
    <div className="svc-mockup">
      <div className="absolute inset-0 grid grid-cols-3 gap-2 p-6">
        {/* Logo tile */}
        <div className="bg-white rounded-lg flex items-center justify-center">
          <div className="font-display font-bold text-lg italic" style={{ background: "linear-gradient(120deg,#f43f5e,#f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>P/</div>
        </div>
        {/* Palette */}
        <div className="bg-white rounded-lg p-2 flex flex-col justify-end gap-1">
          {["#f43f5e", "#f59e0b", "#10b981", "#0a0a0a"].map((c) => (
            <div key={c} className="h-1.5 rounded" style={{ background: c }} />
          ))}
        </div>
        {/* Type */}
        <div className="bg-white rounded-lg p-2 flex flex-col justify-center">
          <div className="text-[7px] text-gray-400 font-mono uppercase tracking-wider">Aa</div>
          <div className="font-display font-bold text-base text-gray-900 leading-none">Studio</div>
        </div>
        <div className="col-span-2 bg-gradient-to-br from-rose-500 to-amber-500 rounded-lg p-3 flex items-end">
          <div className="text-white font-display font-bold text-sm italic leading-tight">your<br />brand.</div>
        </div>
        <div className="bg-white rounded-lg flex items-center justify-center text-gray-900 font-mono text-[8px]">#f43f5e</div>
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
