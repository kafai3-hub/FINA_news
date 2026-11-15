import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  books,
  carry,
  currencySplit,
  debtStock,
  hkdSize,
  pickup,
  q3Cash,
  rateShock,
  sgdSize,
  tightening,
  yields,
} from "@/data/brief";

const ink = "var(--color-ink)";
const forest = "var(--color-forest)";
const brass = "var(--color-brass)";
const risk = "var(--color-risk)";
const grid = "color-mix(in srgb, var(--color-ink) 12%, transparent)";

function Tip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-ink/15 bg-card px-3 py-2 text-sm text-ink">
      {label ? <p className="mb-1 font-medium">{label}</p> : null}
      {payload.map((item) => (
        <p key={`${item.name}-${item.value}`}>
          {item.name}: {typeof item.value === "number" ? item.value.toFixed(2) : item.value}
        </p>
      ))}
    </div>
  );
}

function Frame({ children, tall = false }: { children: ReactNode; tall?: boolean }) {
  return <div className={tall ? "h-96 w-full" : "h-72 w-full"}>{children}</div>;
}

export function OpenChart() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Frame>
        <p className="mb-1 text-sm font-medium text-ink/70">US$ bn equivalent</p>
        <ResponsiveContainer width="100%" height="78%">
          <PieChart>
            <Pie
              data={currencySplit}
              dataKey="usd"
              nameKey="name"
              innerRadius="58%"
              outerRadius="80%"
              paddingAngle={2}
              stroke="var(--color-paper)"
            >
              <Cell fill={forest} name="HKD" />
              <Cell fill={brass} name="SGD" />
            </Pie>
            <Tooltip content={<Tip />} />
            <Legend
              payload={[
                { value: "HKD 2.0", type: "square", color: forest, id: "hkd" },
                { value: "SGD 1.8", type: "square", color: brass, id: "sgd" },
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </Frame>
      <Frame>
        <p className="mb-2 text-sm font-medium text-ink/70">HKD reoffer, %</p>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={yields.filter((row) => row.book === "new")} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={grid} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: ink, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis domain={[4, 5.6]} tick={{ fill: ink, fontSize: 12 }} axisLine={false} tickLine={false} width={36} />
            <Tooltip content={<Tip />} />
            <Bar dataKey="yield" name="Yield" fill={forest} radius={[6, 6, 0, 0]} maxBarSize={56}>
              <LabelList dataKey="yield" position="top" fill={ink} formatter={(v: number) => v.toFixed(2)} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Frame>
    </div>
  );
}

export function YieldChart() {
  return (
    <Frame tall>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={yields} layout="vertical" margin={{ top: 4, right: 36, left: 8, bottom: 4 }}>
          <CartesianGrid stroke={grid} horizontal={false} />
          <XAxis type="number" domain={[3.6, 5.6]} tick={{ fill: ink, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" width={84} tick={{ fill: ink, fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip content={<Tip />} />
          <Bar dataKey="yield" name="Yield %" radius={[0, 6, 6, 0]} maxBarSize={22}>
            {yields.map((row) => (
              <Cell key={row.name} fill={row.book === "new" ? forest : brass} />
            ))}
            <LabelList dataKey="yield" position="right" fill={ink} formatter={(v: number) => v.toFixed(2)} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Frame>
  );
}

export function TightenChart() {
  return (
    <Frame>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={tightening} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={grid} vertical={false} />
          <XAxis dataKey="tenor" tick={{ fill: ink, fontSize: 13 }} axisLine={false} tickLine={false} />
          <YAxis domain={[4, 6]} tick={{ fill: ink, fontSize: 12 }} axisLine={false} tickLine={false} width={36} />
          <Tooltip content={<Tip />} />
          <Legend />
          <Bar dataKey="ipt" name="IPT" fill={brass} radius={[6, 6, 0, 0]} maxBarSize={48} />
          <Bar dataKey="final" name="Final" fill={forest} radius={[6, 6, 0, 0]} maxBarSize={48} />
        </BarChart>
      </ResponsiveContainer>
    </Frame>
  );
}

export function SizeChart() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Frame>
        <p className="mb-2 text-sm font-medium text-ink/70">HKD, HK$ bn</p>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={hkdSize} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={grid} vertical={false} />
            <XAxis dataKey="tenor" tick={{ fill: ink, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: ink, fontSize: 12 }} axisLine={false} tickLine={false} width={32} />
            <Tooltip content={<Tip />} />
            <Bar dataKey="hkdbn" name="HK$ bn" fill={forest} radius={[6, 6, 0, 0]} maxBarSize={52}>
              <LabelList dataKey="hkdbn" position="top" fill={ink} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Frame>
      <Frame>
        <p className="mb-2 text-sm font-medium text-ink/70">SGD, S$ bn</p>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={sgdSize} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={grid} vertical={false} />
            <XAxis dataKey="tenor" tick={{ fill: ink, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: ink, fontSize: 12 }} axisLine={false} tickLine={false} width={32} />
            <Tooltip content={<Tip />} />
            <Bar dataKey="sgdbn" name="S$ bn" fill={brass} radius={[6, 6, 0, 0]} maxBarSize={48}>
              <LabelList dataKey="sgdbn" position="top" fill={ink} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Frame>
    </div>
  );
}

export function BooksChart() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Frame>
        <p className="mb-2 text-sm font-medium text-ink/70">Hong Kong dollar, HK$ bn</p>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={books.hkd} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={grid} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: ink, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: ink, fontSize: 12 }} axisLine={false} tickLine={false} width={36} />
            <Tooltip content={<Tip />} />
            <Bar dataKey="value" name="HK$ bn" radius={[6, 6, 0, 0]} maxBarSize={72}>
              {books.hkd.map((row) => (
                <Cell key={row.name} fill={row.name === "Print" ? forest : brass} />
              ))}
              <LabelList dataKey="value" position="top" fill={ink} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Frame>
      <Frame>
        <p className="mb-2 text-sm font-medium text-ink/70">Singapore dollar, S$ bn</p>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={books.sgd} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={grid} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: ink, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: ink, fontSize: 12 }} axisLine={false} tickLine={false} width={36} />
            <Tooltip content={<Tip />} />
            <Bar dataKey="value" name="S$ bn" radius={[6, 6, 0, 0]} maxBarSize={72}>
              {books.sgd.map((row) => (
                <Cell key={row.name} fill={row.name === "Print" ? forest : brass} />
              ))}
              <LabelList dataKey="value" position="top" fill={ink} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Frame>
    </div>
  );
}

export function CarryChart() {
  return (
    <Frame>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={carry} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={grid} vertical={false} />
          <XAxis dataKey="name" tick={{ fill: ink, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 6]} tick={{ fill: ink, fontSize: 12 }} axisLine={false} tickLine={false} width={32} />
          <Tooltip content={<Tip />} />
          <Bar dataKey="rate" name="%" radius={[6, 6, 0, 0]} maxBarSize={64}>
            {carry.map((row) => (
              <Cell key={row.name} fill={row.role === "fund" ? risk : forest} />
            ))}
            <LabelList dataKey="rate" position="top" fill={ink} formatter={(v: number) => v.toFixed(2)} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Frame>
  );
}

export function IssuerChart() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Frame>
        <p className="mb-2 text-sm font-medium text-ink/70">Long-term debt, US$ bn</p>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={debtStock} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={grid} vertical={false} />
            <XAxis dataKey="when" tick={{ fill: ink, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: ink, fontSize: 12 }} axisLine={false} tickLine={false} width={36} />
            <Tooltip content={<Tip />} />
            <Bar dataKey="debt" name="US$ bn" fill={ink} radius={[6, 6, 0, 0]} maxBarSize={72}>
              <LabelList dataKey="debt" position="top" fill={ink} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Frame>
      <Frame>
        <p className="mb-2 text-sm font-medium text-ink/70">Q3 2026, US$ bn</p>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={q3Cash} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={grid} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: ink, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: ink, fontSize: 12 }} axisLine={false} tickLine={false} width={36} />
            <Tooltip content={<Tip />} />
            <Bar dataKey="value" name="US$ bn" radius={[6, 6, 0, 0]} maxBarSize={72}>
              {q3Cash.map((row) => (
                <Cell key={row.name} fill={row.name === "Capex" ? risk : forest} />
              ))}
              <LabelList dataKey="value" position="top" fill={ink} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Frame>
    </div>
  );
}

export function RiskChart() {
  return (
    <div className="grid gap-6 md:grid-cols-5">
      <div className="h-72 md:col-span-3">
        <p className="mb-2 text-sm font-medium text-ink/70">Approx. price change, %</p>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={rateShock} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={grid} vertical={false} />
            <XAxis dataKey="move" tick={{ fill: ink, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: ink, fontSize: 12 }} axisLine={false} tickLine={false} width={36} />
            <Tooltip content={<Tip />} />
            <Legend />
            <Bar dataKey="y2" name="2y" fill={brass} radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Bar dataKey="y5" name="5y" fill={ink} radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Bar dataKey="y10" name="10y" fill={risk} radius={[4, 4, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="h-72 md:col-span-2">
        <p className="mb-2 text-sm font-medium text-ink/70">Pickup vs named comp, bp</p>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={pickup} layout="vertical" margin={{ top: 8, right: 28, left: 8, bottom: 0 }}>
            <CartesianGrid stroke={grid} horizontal={false} />
            <XAxis type="number" tick={{ fill: ink, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="pair" width={108} tick={{ fill: ink, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<Tip />} />
            <Bar dataKey="bp" name="bp" fill={forest} radius={[0, 6, 6, 0]} maxBarSize={22}>
              <LabelList dataKey="bp" position="right" fill={ink} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export const chartFor: Record<string, () => ReactNode> = {
  open: OpenChart,
  yields: YieldChart,
  tighten: TightenChart,
  size: SizeChart,
  books: BooksChart,
  carry: CarryChart,
  issuer: IssuerChart,
  risk: RiskChart,
};
