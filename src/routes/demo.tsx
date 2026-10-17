import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard, Upload, FileText, ListChecks, Network, History, Bell, CheckCircle2, AlertTriangle,
  XCircle, Eye, Loader2, FileUp, Download, ChevronLeft, Sparkles,
} from "lucide-react";
import { Logo } from "@/components/Logo";

type View = "overview" | "new" | "documents" | "results" | "evidence" | "graph" | "audit" | "report";

export const Route = createFileRoute("/demo")({
  validateSearch: (s: Record<string, unknown>): { view?: View } => ({ view: s.view as View | undefined }),
  head: () => ({
    meta: [
      { title: "Live Demo — TenderLens AI" },
      { name: "description", content: "Interactive TenderLens AI demo: screen vendor documents, view evidence, explore the identity graph." },
      { property: "og:title", content: "Live Demo — TenderLens AI" },
      { property: "og:description", content: "Try an in-browser vendor compliance screening with illustrative data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Demo,
});

type Status = "Compliant" | "Requires Review" | "Non-Compliant";
type Doc = { id: string; name: string; file: string; info: string; status: Status; conf: number; fields: [string, string][]; reason: string };

const DOCS: Doc[] = [
  { id: "gst", name: "GST Registration", file: "GST_Certificate.pdf", info: "GSTIN 27AABCS1234F1Z5", status: "Compliant", conf: 97,
    fields: [["Legal name", "Shree Infotech Pvt Ltd"], ["GSTIN", "27AABCS1234F1Z5"], ["State", "Maharashtra"], ["Status", "Active"]], reason: "GSTIN format valid; embedded PAN matches PAN card." },
  { id: "pan", name: "PAN Card", file: "PAN_Card.png", info: "PAN AABCS1234F", status: "Compliant", conf: 95,
    fields: [["Name", "Shree Infotech Pvt Ltd"], ["PAN", "AABCS1234F"], ["Type", "Company"]], reason: "PAN matches GSTIN characters 3–12 and name matches GST." },
  { id: "udyam", name: "Udyam Certificate", file: "Udyam_Certificate.pdf", info: "UDYAM-MH-19-0012345", status: "Requires Review", conf: 78,
    fields: [["Enterprise name", "Shri Infotech Private Limited"], ["Udyam no.", "UDYAM-MH-19-0012345"], ["Category", "Small"], ["PAN", "AABCS1234F"]], reason: "PAN matches, but enterprise name differs from GST legal name (Shree vs Shri). Officer review suggested." },
  { id: "oem", name: "OEM Authorization", file: "OEM_Authorization.pdf", info: "Valid until 31 Dec 2024", status: "Non-Compliant", conf: 93,
    fields: [["Authorized vendor", "Shree Infotech Pvt Ltd"], ["OEM", "Dell Technologies (demo)"], ["Validity", "31 December 2024"], ["Page", "2"]], reason: "Validity date (31 Dec 2024) falls before tender date (17 Oct 2026)." },
];

const tone: Record<Status, string> = {
  Compliant: "bg-success/15 text-success ring-success/30",
  "Requires Review": "bg-warning/20 text-foreground ring-warning/40",
  "Non-Compliant": "bg-destructive/15 text-destructive ring-destructive/30",
};
const Icon: Record<Status, any> = { Compliant: CheckCircle2, "Requires Review": AlertTriangle, "Non-Compliant": XCircle };
function Badge({ s }: { s: Status }) {
  const I = Icon[s];
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${tone[s]}`}><I className="h-3.5 w-3.5" />{s}</span>;
}
const DemoTag = () => <span className="rounded-full bg-navy px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">Illustrative demo data</span>;

const REQUIRED = ["GST Registration Certificate", "PAN Card", "Udyam/MSME Certificate", "OEM Authorization Letter"];
const STAGES = ["Reading pages (simulated OCR)", "Extracting fields", "Validating tender rules", "Connecting identity evidence", "Preparing results"];

function Demo() {
  const search = Route.useSearch();
  const [view, setView] = useState<View>(search.view ?? "new");
  const [files, setFiles] = useState<{ name: string; url?: string; type: string }[]>([]);
  const [sample, setSample] = useState(false);
  const [stage, setStage] = useState(-1);
  const [done, setDone] = useState(!!search.view);
  const [sel, setSel] = useState<Doc>(DOCS[3]);
  const [log, setLog] = useState<[string, string, string, string][]>(() => (search.view ? seedLog() : []));
  const add = (a: string, r: string, s: string) => setLog((l) => [...l, [new Date().toLocaleTimeString(), a, r, s]]);

  useEffect(() => { if (search.view) setView(search.view); }, [search.view]);

  const run = () => {
    add("Screening started", `${sample ? "4 sample" : files.length} documents`, "System");
    let i = 0; setStage(0);
    const t = setInterval(() => {
      i++;
      if (i >= STAGES.length) { clearInterval(t); setStage(-1); setDone(true); setLog((l) => [...l, ...seedLog().slice(1)]); setView("results"); }
      else setStage(i);
    }, 700);
  };
  const openEvidence = (d: Doc) => { setSel(d); setView("evidence"); add("Evidence opened", d.name, "Officer"); };

  const menu: [View, string, any][] = [["overview", "Overview", LayoutDashboard], ["new", "New Screening", Upload], ["documents", "Documents", FileText], ["results", "Compliance Results", ListChecks], ["graph", "Identity Graph", Network], ["audit", "Audit Trail", History]];

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="no-print hidden w-64 shrink-0 flex-col border-r bg-background p-4 lg:flex">
        <Link to="/"><Logo /></Link>
        <nav className="mt-8 space-y-1">
          {menu.map(([v, l, I]) => (
            <button key={v} onClick={() => setView(v)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${view === v || (v === "results" && view === "evidence") || (v === "audit" && view === "report") ? "bg-primary text-primary-foreground shadow-md" : "text-foreground/70 hover:bg-muted"}`}>
              <I className="h-4 w-4" />{l}
            </button>
          ))}
        </nav>
        <div className="mt-auto rounded-xl bg-navy p-4 text-xs text-primary-foreground/80">Frontend prototype. No real OCR or government verification is performed.</div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="no-print flex flex-wrap items-center gap-3 border-b bg-background px-5 py-3">
          <Link to="/" className="lg:hidden"><ChevronLeft /></Link>
          <select className="rounded-lg border bg-background px-3 py-2 text-sm">
            <option>GEM/2026/B/48213 · Laptops Supply</option>
            <option>GEM/2026/B/47109 · Network Switches</option>
          </select>
          <span className="rounded-lg bg-muted px-3 py-2 text-sm">Vendor: <b>Shree Infotech (demo)</b></span>
          <div className="ml-auto flex items-center gap-3">
            <button onClick={() => setView("audit")} className="relative rounded-full p-2 hover:bg-muted" aria-label="Notifications"><Bell className="h-5 w-5" />{done && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />}</button>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary to-cyan text-sm font-bold text-primary-foreground">PO</span>
          </div>
          <div className="flex w-full gap-2 overflow-x-auto lg:hidden">
            {menu.map(([v, l]) => <button key={v} onClick={() => setView(v)} className={`whitespace-nowrap rounded-full px-3 py-1 text-xs ${view === v ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{l}</button>)}
          </div>
        </header>

        <main className="flex-1 p-5 md:p-8">
          {view === "overview" && <Overview done={done} go={setView} />}
          {view === "new" && <NewScreening files={files} setFiles={setFiles} sample={sample} setSample={(b) => { setSample(b); if (b) add("Sample documents loaded", "4 files", "Officer"); }} stage={stage} run={run} add={add} />}
          {view === "documents" && <Documents files={files} sample={sample || done} go={setView} />}
          {(view === "results" || view === "evidence" || view === "graph" || view === "report") && !done ? <NeedRun go={setView} /> : null}
          {view === "results" && done && <Results open={openEvidence} />}
          {view === "evidence" && done && <Evidence d={sel} back={() => setView("results")} pick={setSel} />}
          {view === "graph" && done && <Graph open={openEvidence} />}
          {(view === "audit" || view === "report") && (view === "audit" || done) && <Audit log={log} done={done} report={view === "report"} add={add} />}
        </main>
      </div>
    </div>
  );
}

function seedLog(): [string, string, string, string][] {
  return [
    ["10:02:11", "Screening started", "4 sample documents", "System"],
    ["10:02:14", "Fields extracted", "4 documents parsed (simulated)", "System"],
    ["10:02:15", "Rule: GSTIN–PAN match", "Pass", "Auto"],
    ["10:02:15", "Rule: Name consistency", "Review — Udyam name variance", "Pending officer"],
    ["10:02:16", "Rule: OEM valid on tender date", "Fail — expired 31 Dec 2024", "Pending officer"],
    ["10:02:17", "Results published", "2 compliant, 1 review, 1 non-compliant", "System"],
  ];
}

const Card = ({ children, className = "" }: any) => <div className={`rounded-2xl border bg-card p-6 shadow-sm ${className}`}>{children}</div>;
const Title = ({ t, sub }: { t: string; sub?: string }) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl font-bold text-navy">{t}</h1>{sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}</div><DemoTag /></div>
);

function NeedRun({ go }: { go: (v: View) => void }) {
  return <Card className="mx-auto max-w-lg text-center"><Sparkles className="mx-auto h-8 w-8 text-primary" /><h2 className="mt-3 text-xl font-bold text-navy">Run a screening first</h2><p className="mt-2 text-sm text-muted-foreground">Load sample documents and run screening to see results.</p><button onClick={() => go("new")} className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Go to New Screening</button></Card>;
}

function Overview({ done, go }: { done: boolean; go: (v: View) => void }) {
  const stats = [["Documents", "4"], ["Compliant", done ? "2" : "–"], ["Review", done ? "1" : "–"], ["Non-Compliant", done ? "1" : "–"]];
  return (
    <>
      <Title t="Overview" sub="Tender GEM/2026/B/48213 · Tender date 17 October 2026" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{stats.map(([l, v]) => <Card key={l}><p className="text-sm text-muted-foreground">{l}</p><p className="mt-1 font-display text-3xl font-bold text-navy">{v}</p></Card>)}</div>
      <Card className="mt-6 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-navy to-primary text-primary-foreground">
        <div><h2 className="text-xl font-bold">{done ? "Screening complete — 2 items need attention" : "Start your first screening"}</h2><p className="text-sm text-primary-foreground/70">{done ? "Open results to review evidence." : "Use sample documents to try the demo in one click."}</p></div>
        <button onClick={() => go(done ? "results" : "new")} className="rounded-full bg-background px-5 py-2.5 text-sm font-semibold text-navy">{done ? "View Results" : "New Screening"}</button>
      </Card>
    </>
  );
}

function NewScreening({ files, setFiles, sample, setSample, stage, run, add }: any) {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const accept = (list: FileList | null) => {
    if (!list) return;
    const f = Array.from(list).filter((x) => /\.(pdf|png|jpe?g)$/i.test(x.name)).map((x) => ({ name: x.name, type: x.type, url: URL.createObjectURL(x) }));
    setFiles((p: any) => [...p, ...f]); f.forEach((x) => add("File uploaded", x.name, "Officer"));
  };
  const ready = sample || files.length > 0;
  return (
    <>
      <Title t="New Screening" sub="Upload vendor documents or use the sample set." />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); accept(e.dataTransfer.files); }} onClick={() => ref.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition ${drag ? "border-primary bg-primary/5" : "hover:border-primary/60"}`}>
            <FileUp className="mx-auto h-10 w-10 text-primary" />
            <p className="mt-3 font-semibold text-navy">Drag & drop files, or click to browse</p>
            <p className="text-sm text-muted-foreground">PDF, PNG, JPG</p>
            <input ref={ref} type="file" multiple accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={(e) => accept(e.target.files)} />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button onClick={() => setSample(true)} className={`rounded-full border px-4 py-2 text-sm font-semibold ${sample ? "border-success bg-success/10 text-success" : "hover:border-primary"}`}>{sample ? "✓ Sample documents loaded" : "Use Sample Documents"}</button>
            <button disabled={!ready || stage >= 0} onClick={run} className="ml-auto inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 disabled:opacity-40">
              {stage >= 0 && <Loader2 className="h-4 w-4 animate-spin" />} Run Screening
            </button>
          </div>
          {stage >= 0 && (
            <div className="mt-5 space-y-2">
              <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-gradient-to-r from-primary to-cyan transition-all" style={{ width: `${((stage + 1) / STAGES.length) * 100}%` }} /></div>
              {STAGES.map((s, i) => <p key={s} className={`flex items-center gap-2 text-sm ${i < stage ? "text-success" : i === stage ? "text-primary" : "text-muted-foreground"}`}>{i < stage ? <CheckCircle2 className="h-4 w-4" /> : i === stage ? <Loader2 className="h-4 w-4 animate-spin" /> : <span className="h-4 w-4" />}{s}</p>)}
            </div>
          )}
          {(files.length > 0 || sample) && (
            <ul className="mt-5 divide-y rounded-xl border text-sm">
              {sample && DOCS.map((d) => <li key={d.id} className="flex items-center gap-2 px-4 py-2"><FileText className="h-4 w-4 text-primary" />{d.file}<span className="ml-auto text-xs text-muted-foreground">sample</span></li>)}
              {files.map((f: any) => <li key={f.url} className="flex items-center gap-2 px-4 py-2"><FileText className="h-4 w-4 text-navy" />{f.name}<span className="ml-auto text-xs text-muted-foreground">uploaded</span></li>)}
            </ul>
          )}
          {files.length > 0 && <p className="mt-3 text-xs text-muted-foreground">Note: this prototype shows illustrative results; uploaded files are previewed but not actually analysed.</p>}
        </Card>
        <Card>
          <h3 className="font-semibold text-navy">Required documents</h3>
          <ul className="mt-4 space-y-3 text-sm">{REQUIRED.map((r) => <li key={r} className="flex items-center gap-2">{sample ? <CheckCircle2 className="h-4 w-4 text-success" /> : <span className="h-4 w-4 rounded-full border-2" />}{r}</li>)}</ul>
        </Card>
      </div>
    </>
  );
}

function Documents({ files, sample, go }: any) {
  return (
    <>
      <Title t="Documents" />
      {!sample && files.length === 0 ? <NeedRun go={go} /> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sample && DOCS.map((d) => <Card key={d.id}><FileText className="h-8 w-8 text-primary" /><p className="mt-3 font-semibold text-navy">{d.name}</p><p className="text-xs text-muted-foreground">{d.file} · sample</p></Card>)}
          {files.map((f: any) => <Card key={f.url}>{f.type.startsWith("image") ? <img src={f.url} alt={f.name} className="h-28 w-full rounded-lg object-cover" /> : <FileText className="h-8 w-8 text-navy" />}<p className="mt-3 truncate font-semibold text-navy">{f.name}</p><a href={f.url} target="_blank" rel="noreferrer" className="text-xs text-primary">Open preview</a></Card>)}
        </div>
      )}
    </>
  );
}

function Results({ open }: { open: (d: Doc) => void }) {
  return (
    <>
      <Title t="Compliance Results" sub="Shree Infotech (demo) · GEM/2026/B/48213" />
      <Card className="mb-6 flex flex-wrap items-center gap-4 border-destructive/30">
        <XCircle className="h-10 w-10 text-destructive" />
        <div><p className="text-sm text-muted-foreground">Overall status</p><p className="text-xl font-bold text-navy">Not compliant — 1 failure, 1 review</p></div>
      </Card>
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-muted/60 text-left text-xs uppercase text-muted-foreground"><tr>{["Document", "Extracted Information", "Status", "Confidence", ""].map((h) => <th key={h} className="px-5 py-3">{h}</th>)}</tr></thead>
          <tbody className="divide-y">
            {DOCS.map((d) => (
              <tr key={d.id} onClick={() => open(d)} className="cursor-pointer transition hover:bg-primary/5">
                <td className="px-5 py-4 font-semibold text-navy">{d.name}</td>
                <td className="px-5 py-4 text-muted-foreground">{d.info}</td>
                <td className="px-5 py-4"><Badge s={d.status} /></td>
                <td className="px-5 py-4"><div className="flex items-center gap-2"><div className="h-1.5 w-20 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${d.conf}%` }} /></div>{d.conf}%</div></td>
                <td className="px-5 py-4"><button className="inline-flex items-center gap-1 font-semibold text-primary"><Eye className="h-4 w-4" />View Evidence</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

function Evidence({ d, back, pick }: { d: Doc; back: () => void; pick: (d: Doc) => void }) {
  const isOem = d.id === "oem";
  const highlight = d.status === "Compliant" ? "bg-success/20 ring-success/40" : d.status === "Requires Review" ? "bg-warning/25 ring-warning/50" : "bg-destructive/15 ring-destructive/40 text-destructive";
  const key = d.fields.find(([k]) => /validity|name/i.test(k))?.[1] ?? d.fields[1][1];
  return (
    <>
      <button onClick={back} className="mb-4 inline-flex items-center gap-1 text-sm text-primary"><ChevronLeft className="h-4 w-4" />Back to results</button>
      <Title t={isOem ? "OEM authorization expired" : `${d.name} evidence`} sub={`${d.file} · Page ${isOem ? 2 : 1}`} />
      <div className="mb-4 flex flex-wrap gap-2">{DOCS.map((x) => <button key={x.id} onClick={() => pick(x)} className={`rounded-full px-3 py-1 text-xs font-semibold ${x.id === d.id ? "bg-navy text-primary-foreground" : "bg-background ring-1 ring-border"}`}>{x.name}</button>)}</div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-navy/90 p-6">
          <div className="mx-auto max-w-md rounded-md bg-background p-8 shadow-2xl">
            <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground">Illustrative mock document — not from an upload</p>
            <p className="mt-4 text-center font-display text-lg font-bold text-navy">{isOem ? "Manufacturer Authorization Form" : d.name}</p>
            <div className="mt-5 space-y-2">{[95, 88, 92, 70].map((w, i) => <div key={i} className="h-2 rounded bg-muted" style={{ width: `${w}%` }} />)}</div>
            <p className="mt-5 text-sm leading-relaxed text-foreground/80">
              {isOem ? <>We hereby authorize <b>Shree Infotech Pvt Ltd</b> to quote and supply our products for the referenced tender. This authorization is valid until{" "}</> : <>{d.fields[0][0]}: </>}
              <mark className={`rounded px-1 font-semibold ring-2 ${highlight}`}>{key}</mark>.
            </p>
            <div className="mt-5 space-y-2">{[85, 60, 78].map((w, i) => <div key={i} className="h-2 rounded bg-muted" style={{ width: `${w}%` }} />)}</div>
            <div className="mt-8 flex justify-between text-[10px] text-muted-foreground"><span>Authorized signatory</span><span>Page {isOem ? 2 : 1}</span></div>
          </div>
        </div>
        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between"><h3 className="font-semibold text-navy">Finding</h3><Badge s={d.status} /></div>
            <p className="mt-3 text-sm text-foreground/80">{isOem ? "The authorization validity date falls before the tender date. This document fails the configured validity check." : d.reason}</p>
          </Card>
          <Card>
            <h3 className="font-semibold text-navy">Extracted fields</h3>
            <dl className="mt-3 divide-y text-sm">
              {d.fields.map(([k, v], i) => <div key={k} className="flex items-center justify-between gap-3 py-2"><dt className="text-muted-foreground">{k}</dt><dd className="flex items-center gap-2 text-right font-medium">{v}<span className="rounded bg-muted px-1.5 text-[10px]">{Math.max(70, d.conf - i * 2)}%</span></dd></div>)}
              {isOem && <div className="flex justify-between py-2"><dt className="text-muted-foreground">Tender date</dt><dd className="font-medium">17 October 2026</dd></div>}
            </dl>
          </Card>
          <Card className="text-sm">
            <p><span className="text-muted-foreground">Rule applied: </span><b>{isOem ? "OEM authorization must be valid on the tender date." : d.id === "udyam" ? "Legal name must match across identity documents." : "Identifier must be valid and consistent with linked documents."}</b></p>
            <p className="mt-2"><span className="text-muted-foreground">Source: </span>{d.file}, Page {isOem ? 2 : 1}</p>
            <p className="mt-2 rounded-lg bg-muted p-3 font-mono text-xs">"{isOem ? "This authorization is valid until 31 December 2024." : `${d.fields[0][0]}: ${d.fields[0][1]}`}"</p>
          </Card>
        </div>
      </div>
    </>
  );
}

const NODES = [
  { id: "gst", x: 120, y: 90, l: "GST Registration" },
  { id: "pan", x: 480, y: 90, l: "PAN" },
  { id: "udyam", x: 120, y: 300, l: "Udyam Certificate" },
  { id: "oem", x: 480, y: 300, l: "OEM Authorization" },
];
const EDGES: [string, string, "ok" | "warn", string][] = [
  ["gst", "pan", "ok", "PAN AABCS1234F matches"],
  ["pan", "udyam", "ok", "PAN matches"],
  ["gst", "udyam", "warn", "Name variance"],
  ["gst", "oem", "ok", "Vendor name matches"],
  ["udyam", "oem", "warn", "Name variance"],
];

function Graph({ open }: { open: (d: Doc) => void }) {
  const [sel, setSel] = useState<Doc | null>(DOCS[3]);
  const P = Object.fromEntries(NODES.map((n) => [n.id, n]));
  const col = (s: Status) => (s === "Compliant" ? "fill-success" : s === "Requires Review" ? "fill-warning" : "fill-destructive");
  return (
    <>
      <Title t="Cross-Document Identity Graph" sub="Click a document to inspect extracted fields." />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <svg viewBox="0 0 600 390" className="w-full">
            {EDGES.map(([a, b, t, l]) => {
              const A = P[a], B = P[b];
              return (
                <g key={a + b}>
                  <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} strokeWidth="3" className={t === "ok" ? "stroke-success" : "stroke-warning animate-dash"} />
                  <text x={(A.x + B.x) / 2} y={(A.y + B.y) / 2 - 8} textAnchor="middle" className="fill-muted-foreground text-[11px]">{l}</text>
                </g>
              );
            })}
            {NODES.map((n) => {
              const d = DOCS.find((x) => x.id === n.id)!;
              const active = sel?.id === n.id;
              return (
                <g key={n.id} onClick={() => setSel(d)} className="cursor-pointer">
                  <circle cx={n.x} cy={n.y} r={active ? 46 : 40} className={col(d.status)} opacity=".15" />
                  <circle cx={n.x} cy={n.y} r="28" className={`${col(d.status)} transition`} stroke="white" strokeWidth={active ? 4 : 2} />
                  <text x={n.x} y={n.y + 4} textAnchor="middle" className="pointer-events-none fill-primary-foreground text-[12px] font-bold">{n.id.toUpperCase()}</text>
                  <text x={n.x} y={n.y + 60} textAnchor="middle" className="fill-navy text-[13px] font-semibold">{n.l}</text>
                </g>
              );
            })}
          </svg>
          <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-1"><span className="h-1 w-5 bg-success" />Identifiers match</span><span className="flex items-center gap-1"><span className="h-1 w-5 bg-warning" />Possible mismatch</span><span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-destructive" />Failed check</span></div>
        </Card>
        <Card>
          {sel ? (
            <>
              <div className="flex items-center justify-between"><h3 className="font-semibold text-navy">{sel.name}</h3><Badge s={sel.status} /></div>
              <dl className="mt-4 divide-y text-sm">{sel.fields.map(([k, v]) => <div key={k} className="flex justify-between gap-2 py-2"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-medium">{v}</dd></div>)}</dl>
              <p className="mt-4 rounded-lg bg-muted p-3 text-sm">{sel.reason}</p>
              <button onClick={() => open(sel)} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary"><Eye className="h-4 w-4" />View evidence</button>
            </>
          ) : <p className="text-sm text-muted-foreground">Select a node.</p>}
        </Card>
      </div>
    </>
  );
}

function Audit({ log, done, report, add }: { log: [string, string, string, string][]; done: boolean; report: boolean; add: any }) {
  const print = () => { add("Report downloaded", "Demo report", "Officer"); setTimeout(() => window.print(), 50); };
  return (
    <>
      <Title t={report ? "Final Compliance Report" : "Audit Trail & Report"} sub="All actions recorded in this session" />
      <div className="print-only mb-6"><h1 className="text-2xl font-bold">TenderLens AI — Demo Compliance Report</h1><p>Tender GEM/2026/B/48213 · Vendor Shree Infotech (demo) · Illustrative data only</p></div>
      {done && (
        <Card className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-semibold text-navy">Compliance summary</h3><button onClick={print} className="no-print inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"><Download className="h-4 w-4" />Download Demo Report</button></div>
          <ul className="mt-4 divide-y text-sm">{DOCS.map((d) => <li key={d.id} className="flex flex-wrap items-center gap-3 py-3"><span className="w-44 font-medium">{d.name}</span><Badge s={d.status} /><span className="text-muted-foreground">Evidence: {d.file}, p.{d.id === "oem" ? 2 : 1}</span></li>)}</ul>
        </Card>
      )}
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-muted/60 text-left text-xs uppercase text-muted-foreground"><tr>{["Time", "Action", "Result", "Review status"].map((h) => <th key={h} className="px-5 py-3">{h}</th>)}</tr></thead>
          <tbody className="divide-y">
            {log.length === 0 ? <tr><td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">No actions yet — start a screening.</td></tr> :
              log.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className={`px-5 py-3 ${j === 0 ? "font-mono text-xs text-muted-foreground" : ""}`}>{c}</td>)}</tr>)}
          </tbody>
        </table>
      </Card>
    </>
  );
}
