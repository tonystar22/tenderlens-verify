import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import {
  ScanSearch, FileText, Network, ShieldCheck, ArrowRight, AlertTriangle, XCircle, CheckCircle2,
  Upload, ListChecks, Scale, Link2, UserCheck, Menu, X,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TenderLens AI — Evidence for Better Procurement" },
      { name: "description", content: "Evidence-first AI for government procurement vendor compliance and cross-document identity verification." },
      { property: "og:title", content: "TenderLens AI — Evidence for Better Procurement" },
      { property: "og:description", content: "Verify vendors and trace every compliance finding to its source document." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const nav = [["How It Works", "#how"], ["Evidence", "#evidence"], ["Compliance Checks", "#checks"], ["Audit Trail", "#audit"]];

function Landing() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm font-medium text-foreground/70 md:flex">
            {nav.map(([l, h]) => <a key={l} href={h} className="transition hover:text-primary">{l}</a>)}
            <Link to="/demo" className="rounded-full bg-primary px-4 py-2 text-primary-foreground shadow-md transition hover:bg-primary/90">Try Live Demo</Link>
          </nav>
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
        </div>
        {open && (
          <div className="flex flex-col gap-3 border-t px-5 py-4 text-sm md:hidden">
            {nav.map(([l, h]) => <a key={l} href={h} onClick={() => setOpen(false)}>{l}</a>)}
            <Link to="/demo" className="rounded-full bg-primary px-4 py-2 text-center text-primary-foreground">Try Live Demo</Link>
          </div>
        )}
      </header>

      <section className="bg-hero">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-primary">
              <ShieldCheck className="h-3.5 w-3.5" /> Evidence-first vendor compliance
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-navy md:text-6xl">
              Every vendor verified. <span className="bg-gradient-to-r from-primary to-cyan bg-clip-text text-transparent">Every finding explained.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Evidence-first AI for government procurement compliance. Connect vendor documents, validate tender rules, and trace every finding to its source.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/demo" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:-translate-y-0.5">
                Start Screening <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/demo" search={{ view: "report" }} className="inline-flex items-center gap-2 rounded-full border bg-background px-6 py-3 font-semibold text-navy transition hover:border-primary">
                Explore Sample Report
              </Link>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      <section id="checks" className="mx-auto max-w-7xl px-5 py-20">
        <h2 className="text-center text-3xl font-bold text-navy">Built for procurement officers</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            [FileText, "Read Every Page", "OCR and document field extraction across certificates, letters and scanned annexures."],
            [Network, "Connect Identity Evidence", "Cross-document consistency checks on GSTIN, PAN, Udyam number and legal name."],
            [UserCheck, "Keep Officers in Control", "Human review on every flag, with a complete audit trail of decisions."],
          ].map(([I, t, d]: any) => (
            <div key={t} className="group rounded-2xl border bg-card p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground"><I className="h-5 w-5" /></span>
              <h3 className="mt-4 text-lg font-semibold text-navy">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-5">
          <h2 className="text-center text-3xl font-bold text-navy">How it works</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[[Upload, "Upload Documents"], [ScanSearch, "Extract Fields"], [Scale, "Validate Rules"], [Link2, "Connect Evidence"], [ListChecks, "Review Results"]].map(([I, t]: any, i) => (
              <div key={t} className="relative rounded-2xl border bg-card p-5">
                <span className="text-xs font-semibold text-primary">STEP {i + 1}</span>
                <I className="mt-3 h-6 w-6 text-navy" />
                <p className="mt-2 font-semibold text-navy">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="evidence" className="mx-auto grid max-w-7xl gap-6 px-5 py-20 md:grid-cols-2">
        <div className="rounded-2xl bg-navy p-8 text-primary-foreground">
          <h3 className="text-2xl font-bold">Evidence, not verdicts</h3>
          <p className="mt-3 text-primary-foreground/70">Every finding links to the source file, page and passage — so officers can verify in seconds.</p>
          <Link to="/demo" search={{ view: "evidence" }} className="mt-6 inline-flex items-center gap-2 font-semibold text-cyan">Open sample evidence <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div id="audit" className="rounded-2xl border p-8">
          <h3 className="text-2xl font-bold text-navy">Audit-ready by default</h3>
          <p className="mt-3 text-muted-foreground">Uploads, rule results and reviewer decisions are logged chronologically and exportable as a report.</p>
          <Link to="/demo" search={{ view: "audit" }} className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">View audit trail <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <footer className="bg-navy">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-5 py-8 text-sm text-primary-foreground/60 md:flex-row md:items-center">
          <Logo light />
          <p>Prototype for demonstration. Sample data is illustrative.</p>
        </div>
      </footer>
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto h-[460px] w-full max-w-xl">
      <span className="absolute right-0 top-0 z-30 rounded-full bg-navy px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">Demo data</span>
      <div className="absolute left-0 top-6 w-[62%] animate-floaty rounded-2xl border bg-card p-5 shadow-2xl shadow-navy/10">
        <div className="flex items-center gap-2 border-b pb-3 text-xs text-muted-foreground"><FileText className="h-4 w-4 text-destructive" /> OEM_Authorization.pdf · p.2</div>
        <p className="mt-3 font-display text-sm font-bold text-navy">Manufacturer Authorization Form</p>
        <div className="mt-3 space-y-2">{[90, 75, 85, 60].map((w) => <div key={w} className="h-2 rounded bg-muted" style={{ width: `${w}%` }} />)}</div>
        <p className="mt-4 text-xs text-muted-foreground">This authorization is valid until</p>
        <p className="mt-1 inline-block rounded bg-destructive/15 px-2 py-0.5 text-sm font-semibold text-destructive ring-1 ring-destructive/40">31 December 2024</p>
        <div className="mt-3 space-y-2">{[80, 50].map((w) => <div key={w} className="h-2 rounded bg-muted" style={{ width: `${w}%` }} />)}</div>
      </div>
      <div className="absolute right-0 top-20 z-20 w-[52%] rounded-2xl border bg-card p-4 shadow-xl" style={{ animation: "floaty 7s ease-in-out infinite 1s" }}>
        <div className="flex items-center gap-2 text-sm font-semibold text-destructive"><XCircle className="h-4 w-4" /> Non-Compliant</div>
        <p className="mt-2 text-sm font-semibold text-navy">OEM authorization expired</p>
        <dl className="mt-2 space-y-1 text-xs text-muted-foreground">
          <div>Source: <b className="text-foreground">OEM_Authorization.pdf</b></div>
          <div>Page: <b className="text-foreground">2</b></div>
          <div>Rule: Valid on tender date</div>
        </dl>
      </div>
      <div className="absolute bottom-0 left-8 right-0 rounded-2xl border bg-card p-4 shadow-xl">
        <p className="text-xs font-semibold text-muted-foreground">Identity graph</p>
        <svg viewBox="0 0 400 90" className="mt-1 w-full">
          <line x1="50" y1="45" x2="150" y2="45" className="stroke-success" strokeWidth="2" />
          <line x1="150" y1="45" x2="250" y2="45" className="stroke-warning animate-dash" strokeWidth="2" />
          <line x1="250" y1="45" x2="350" y2="45" className="stroke-success" strokeWidth="2" />
          {[["GST", 50, "fill-success"], ["PAN", 150, "fill-success"], ["Udyam", 250, "fill-warning"], ["OEM", 350, "fill-destructive"]].map(([l, x, c]: any) => (
            <g key={l}><circle cx={x} cy="45" r="20" className={c} opacity=".15" /><circle cx={x} cy="45" r="9" className={c} /><text x={x} y="84" textAnchor="middle" className="fill-navy text-[11px] font-semibold">{l}</text></g>
          ))}
        </svg>
        <div className="mt-1 flex items-center gap-2 rounded-lg bg-warning/15 px-3 py-1.5 text-xs text-foreground"><AlertTriangle className="h-3.5 w-3.5 text-warning" /> Name variance: "Shree Infotech Pvt Ltd" vs "Shri Infotech Private Limited"</div>
      </div>
      <CheckCircle2 className="absolute left-[55%] top-2 h-8 w-8 text-success" />
    </div>
  );
}
