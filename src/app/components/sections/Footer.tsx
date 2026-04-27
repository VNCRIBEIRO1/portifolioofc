import Image from "next/image";
import { CNPJ_FMT, COMPANY_NAME, EMAIL, PHONE_PRETTY, WA_LINK } from "../../lib/constants";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[var(--ink)] text-white px-6 pt-20 pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-14 border-b border-white/10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <Image src="/images/brand/logo-white.svg" alt={COMPANY_NAME} width={140} height={40} />
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-md">
              Sites, landing pages, automações e CRMs sob medida — focados em conversão real.
              Atendimento direto com o fundador.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/50 mb-4">Navegar</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#servicos" className="hover:text-white/70">Serviços</a></li>
              <li><a href="#trabalhos" className="hover:text-white/70">Trabalhos</a></li>
              <li><a href="#promo" className="hover:text-white/70">Promo R$199</a></li>
              <li><a href="#sobre" className="hover:text-white/70">Sobre</a></li>
              <li><a href="#contato" className="hover:text-white/70">Contato</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/50 mb-4">Contato</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={WA_LINK("Olá Vinícius!")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white/70"
                >
                  WhatsApp · {PHONE_PRETTY}
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className="hover:text-white/70">{EMAIL}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-between text-xs text-white/50">
          <div>
            © {year} {COMPANY_NAME} · CNPJ {CNPJ_FMT}
          </div>
          <div>Feito com cuidado em São Paulo · Atendimento Brasil inteiro.</div>
        </div>
      </div>
    </footer>
  );
}
