interface ChartPoint { label: string; value: number; }

export function ProgressLineChart({ points, unit, color = "var(--aera-forest)", minimumSpan }: { points: ChartPoint[]; unit: string; color?: string; minimumSpan: number }) {
  if (points.length < 2) return <p className="py-12 text-center text-sm text-black/45">At least two records are needed for a trend.</p>;
  const width = 620;
  const height = 180;
  const values = points.map((point) => point.value);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const center = (rawMin + rawMax) / 2;
  const span = Math.max(minimumSpan, rawMax - rawMin);
  const domainMin = center - span * .6;
  const domainMax = center + span * .6;
  const x = (index: number) => index / (points.length - 1) * width;
  const y = (value: number) => height - ((value - domainMin) / (domainMax - domainMin)) * height;
  const path = points.map((point, index) => `${index ? "L" : "M"}${x(index).toFixed(1)},${y(point.value).toFixed(1)}`).join(" ");
  const first = points[0];
  const last = points.at(-1)!;
  return <figure aria-label={`${first.label} to ${last.label}. Values range from ${rawMin} to ${rawMax} ${unit}.`}>
    <div className="flex justify-between text-[10px] font-semibold text-black/40"><span>{domainMax.toFixed(1)} {unit}</span><span>Displayed range: {(domainMax - domainMin).toFixed(1)} {unit}</span></div>
    <svg viewBox={`0 0 ${width} ${height}`} className="mt-2 h-44 w-full overflow-visible" preserveAspectRatio="none" role="img">
      {[0, .5, 1].map((ratio) => <line key={ratio} x1="0" x2={width} y1={height * ratio} y2={height * ratio} stroke="rgba(23,23,23,.09)" />)}
      <path d={path} fill="none" stroke={color} strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((point, index) => <circle key={`${point.label}-${index}`} cx={x(index)} cy={y(point.value)} r="4" fill={color} aria-label={`${point.label}: ${point.value} ${unit}`} />)}
    </svg>
    <div className="mt-2 flex justify-between text-[10px] text-black/40"><span>{first.label}</span><span>{last.label}</span></div>
  </figure>;
}

export function ProgressBarChart({ points, color = "var(--aera-forest)" }: { points: ChartPoint[]; color?: string }) {
  return <figure aria-label={`Percentage chart from ${points[0]?.label ?? "start"} to ${points.at(-1)?.label ?? "end"}.`}>
    <div className="flex h-48 items-end gap-3 border-b border-black/10 pt-5">{points.map((point) => <div key={point.label} className="flex h-full flex-1 flex-col justify-end"><span className="mb-2 text-center text-xs font-bold">{point.value}%</span><div className="w-full rounded-t-md" style={{ height: `${point.value}%`, backgroundColor: color }}><span className="sr-only">{point.label}: {point.value}%</span></div></div>)}</div>
    <div className="mt-2 grid text-center text-[10px] text-black/40" style={{ gridTemplateColumns: `repeat(${points.length},minmax(0,1fr))` }}>{points.map((point) => <span key={point.label}>{point.label}</span>)}</div>
  </figure>;
}
