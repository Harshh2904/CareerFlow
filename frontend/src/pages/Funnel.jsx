import { Icon } from "../components.jsx"

export default function Funnel({ counts, total, openNew }) {
  const interviews = counts.Interview + counts.Offer
  const stages = [
    ["Applied", total, "applied"],
    ["Reached interview", interviews, "interview"],
    ["Offers", counts.Offer, "offer"]
  ]

  const W = 600
  const widths = stages.map(([, n]) =>
    total === 0 ? 0 : Math.max((n / total) * 560, n > 0 ? 28 : 0)
  )
  const rate = (a, b) => (b === 0 ? 0 : Math.round((a / b) * 100))
  const r1 = rate(interviews, total)
  const r2 = rate(counts.Offer, interviews)

  let tip = "Keep applying and moving your cards. Your funnel fills in as you go."
  if (total >= 5 && r1 < 15) {
    tip = "Few applications reach an interview. Tailor your resume to each job, and check the Match page before you apply."
  } else if (interviews >= 3 && r2 < 25) {
    tip = "You get interviews but few offers. Practice answers out loud and ask for feedback after each round."
  } else if (total >= 5) {
    tip = "Your funnel looks healthy. Keep the pace and follow up on applications older than a week."
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Funnel</h1>
          <p>See where your search gains or loses momentum.</p>
        </div>
        <button className="btn primary" onClick={openNew}>
          <Icon name="plus" size={16} /> New application
        </button>
      </div>

      <section className="panel">
        <svg className="fn-svg" viewBox={"0 0 " + W + " 330"} role="img" aria-label="Application funnel">
          {stages.slice(0, 2).map(([, , tone], i) => (
            <polygon
              key={tone}
              points={
                (W - widths[i]) / 2 + "," + (80 + i * 120) + " " +
                (W + widths[i]) / 2 + "," + (80 + i * 120) + " " +
                (W + widths[i + 1]) / 2 + "," + (120 + i * 120) + " " +
                (W - widths[i + 1]) / 2 + "," + (120 + i * 120)
              }
              style={{ fill: "var(--" + tone + ")", opacity: 0.28 }}
            />
          ))}
          {stages.map(([label, n, tone], i) => (
            <g key={label}>
              <rect x={(W - widths[i]) / 2} y={20 + i * 120} width={widths[i]} height="60" rx="14"
                style={{ fill: "var(--" + tone + ")" }} />
              <text x={W / 2} y={12 + i * 120} textAnchor="middle" className="fn-label">
                {label}
              </text>
              <text x={W / 2} y={59 + i * 120} textAnchor="middle" className="fn-num"
                style={{ fill: "var(--on-" + tone + ")" }}>
                {n}
              </text>
            </g>
          ))}
        </svg>

        <div className="fn-rates">
          <div><strong>{r1}%</strong><span>of applications reached interview</span></div>
          <div><strong>{r2}%</strong><span>of interviews became offers</span></div>
          <div><strong>{counts.Rejected}</strong><span>closed as rejected</span></div>
        </div>
        <p className="rd-hint">{tip}</p>
      </section>
    </>
  )
}