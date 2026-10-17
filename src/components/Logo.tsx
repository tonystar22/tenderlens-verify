import { ScanSearch } from "lucide-react";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-cyan text-primary-foreground shadow-md">
        <ScanSearch className="h-5 w-5" />
      </span>
      <span className="leading-tight">
        <span className={`block font-display text-base font-bold ${light ? "text-primary-foreground" : "text-navy"}`}>TenderLens AI</span>
        <span className={`block text-[10px] uppercase tracking-widest ${light ? "text-primary-foreground/60" : "text-muted-foreground"}`}>Evidence for Better Procurement</span>
      </span>
    </span>
  );
}

