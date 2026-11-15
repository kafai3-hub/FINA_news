import { useEffect, useState } from "react";
import {
  BooksChart,
  CarryChart,
  IssuerChart,
  OpenChart,
  RiskChart,
  SizeChart,
  TightenChart,
  YieldChart,
} from "@/components/charts";
import { previewAsset } from "@/lib/preview-path-prefix";

const sections = [
  {
    kicker: "The print",
    title: "HK$16bn, plus a Singapore dollar leg",
    text: "About US$3.8bn together. The Hong Kong dollar bonds came at 4.35%, 4.70% and 5.20%.",
    chart: OpenChart,
  },
  {
    kicker: "Comps",
    title: "The new curve sits above the local book",
    text: "MTR, the Airport Authority and HK Electric were indicated around 4.0–4.3%. Alphabet’s 10-year is 5.20%.",
    chart: YieldChart,
  },
  {
    kicker: "Pricing",
    title: "Books pulled the deal in by 25–30bp",
    text: "Initial talk was 4.60 / 5.00 / 5.50. Final reoffer was tighter on every Hong Kong dollar tranche.",
    chart: TightenChart,
  },
  {
    kicker: "Size",
    title: "Most of the Hong Kong dollar size is short",
    text: "HK$7.5bn two-year, HK$7.0bn five-year, and only HK$1.5bn in the ten-year.",
    chart: SizeChart,
  },
  {
    kicker: "Demand",
    title: "Orders ran ahead of the print",
    text: "Hong Kong dollar orders were about HK$32.5bn against a HK$16bn print. Singapore dollar orders were about S$4bn.",
    chart: BooksChart,
  },
  {
    kicker: "Carry",
    title: "The gap over HIBOR is not locked",
    text: "One-month HIBOR was about 2.68%. Funding is floating. The coupons are fixed for two, five and ten years.",
    chart: CarryChart,
  },
  {
    kicker: "Issuer",
    title: "Debt is up, and the cash gap is open",
    text: "Alphabet debt rose from US$46.5bn at end-2025 to about US$125bn by September 2026. Third-quarter capex was US$51.4bn against operating cash flow of US$42.3bn.",
    chart: IssuerChart,
  },
  {
    kicker: "Risk",
    title: "The pickup is the payment for price risk",
    text: "The ten-year pays about 102bp more than MTR 2036. A 100bp rise in yields takes roughly 7.5 points off that bond.",
    chart: RiskChart,
  },
];

function Download({ href, label, tone = "solid" }: { href: string; label: string; tone?: "solid" | "line" }) {
  const [url, setUrl] = useState(href);
  useEffect(() => {
    setUrl(previewAsset(href));
  }, [href]);
  const className =
    tone === "solid"
      ? "inline-flex h-11 items-center rounded-full bg-ink px-4 text-sm font-medium text-paper"
      : "inline-flex h-11 items-center rounded-full border border-ink/20 px-4 text-sm font-medium";
  return (
    <a href={url} download className={className}>
      {label}
    </a>
  );
}

export function Briefing() {
  const [video, setVideo] = useState("/briefing.mp4");
  const [poster, setPoster] = useState("/poster.png");
  useEffect(() => {
    setVideo(previewAsset("/briefing.mp4"));
    setPoster(previewAsset("/poster.png"));
  }, []);

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <header className="border-b border-ink/10">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-8 sm:px-8">
          <p className="text-xs tracking-[0.18em] text-brass uppercase">FINA news · Debt and credit · 12 Nov 2026</p>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl">Alphabet’s first Hong Kong dollar bonds</h1>
              <p className="mt-3 text-lg text-ink/80">
                Aa2 / AA+. A scarce high-grade Hong Kong dollar name, priced inside guidance, with a yield pickup that is mostly duration.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 print:hidden">
              <Download href="/alphabet-hkd-brief.pdf" label="Download PDF" />
              <Download href="/briefing.mp4" label="Download video" tone="line" />
            </div>
          </div>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              ["HK$16bn", "Hong Kong dollar print"],
              ["5.20%", "Ten-year reoffer"],
              ["+102bp", "Versus MTR 2036"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-xl border border-ink/10 bg-card px-4 py-3">
                <dt className="font-serif text-3xl tracking-tight">{value}</dt>
                <dd className="mt-1 text-sm text-ink/70">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-10 px-5 py-8 sm:px-8">
        {sections.map((section) => (
          <section key={section.title} className="grid break-inside-avoid gap-3">
            <div>
              <p className="text-xs tracking-[0.16em] text-brass uppercase">{section.kicker}</p>
              <h2 className="font-serif text-2xl tracking-tight sm:text-3xl">{section.title}</h2>
              <p className="mt-1 max-w-3xl text-ink/80">{section.text}</p>
            </div>
            <div className="rounded-xl border border-ink/10 bg-card p-3 sm:p-4">
              <section.chart />
            </div>
          </section>
        ))}

        <section className="grid gap-3 print:hidden">
          <div>
            <p className="text-xs tracking-[0.16em] text-brass uppercase">Video</p>
            <h2 className="font-serif text-2xl tracking-tight">Two-minute narration</h2>
          </div>
          <video className="w-full rounded-xl bg-ink" controls playsInline preload="metadata" poster={poster} src={video} />
        </section>
      </main>

      <footer className="mx-auto max-w-5xl px-5 pb-10 text-xs text-ink/55 sm:px-8">
        Reoffer and size from reported term sheets, 12 November 2026. Local yields are secondary indications around launch, not a same-day composite. Duration moves are approximate modified-duration estimates.
      </footer>
    </div>
  );
}
