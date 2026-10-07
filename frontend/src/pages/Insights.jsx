import { STAGES } from "../components.jsx"

export default function Insights({ applications, counts, total }) {
  const pct = (n) => (total === 0 ? 0 : Math.round((n / total) * 100))

  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setDate(1)
    d.setMonth(d.getMonth() - (5 - i))
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    return {
      label: d.toLocaleString("en-US", { month: "short" }),
      count: applications.filter((a) => a.date?.startsWith(key)).length
    }
  })
  const maxMonth = Math.max(1, ...months.map((m) => m.count))

  const byLocation = Object.entries(
    applications.reduce((acc, a) => {
      const place = a.location?.trim()
      if (place) acc[place] = (acc[place] || 0) + 1
      return acc
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const maxPlace = Math.max(1, ...byLocation.map(([, n]) => n))

  let offset = 0
  const slices = STAGES.map((stage) => {
    const share = total === 0 ? 0 : (counts[stage] / total) * 100
    const slice = { stage, share, offset }
    offset += share
    return slice
  })

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Insights</h1>
          <p>What your search looks like in numbers.</p>
        </div>
      </div>

      <div className="kpis">
        <div className="kpi loud">
          <strong>{pct(counts.Interview + counts.Offer)}%</strong>
          <span>Reached interview or offer</span>
        </div>
        <div className="kpi">
          <strong>{pct(counts.Offer)}%</strong>
          <span>Turned into offers</span>
        </div>
        <div className="kpi">
          <strong>{months[5].count}</strong>
          <span>Applied this month</span>
        </div>
        <div className="kpi">
          <strong>{counts.Rejected}</strong>
          <span>Closed as rejected</span>
        </div>
      </div>

      <div className="charts">
        <section className="panel">
          <h3>Applications per month</h3>
          <div className="bars">
            {months.map((m) => (
              <div className="bar-col" key={m.label}>
                <b>{m.count}</b>
                <div className="bar" style={{ height: `${(m.count / maxMonth) * 100}%` }}></div>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <h3>Where they stand</h3>
          <div className="donut-wrap">
            <svg className="donut" viewBox="0 0 36 36" role="img" aria-label="Status split">
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="var(--line)" strokeWidth="5" />
              {slices.map((s) => (
                <circle key={s.stage} cx="18" cy="18" r="15.9155" fill="none"
                  stroke={`var(--${s.stage.toLowerCase()})`} strokeWidth="5"
                  strokeDasharray={`${s.share} ${100 - s.share}`}
                  strokeDashoffset={-s.offset}
                  transform="rotate(-90 18 18)" />
              ))}
            </svg>
            <ul className="legend">
              {STAGES.map((s) => (
                <li key={s}>
                  <i className={s.toLowerCase()}></i>
                  {s} <b>{counts[s]}</b>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <section className="panel wide">
        <h3>Top locations</h3>
        {byLocation.length === 0 ? (
          <p className="panel-empty">Add a location to your applications to see them here.</p>
        ) : (
          byLocation.map(([place, n]) => (
            <div className="loc-row" key={place}>
              <span>{place}</span>
              <div className="loc-track">
                <div className="loc-fill" style={{ width: `${(n / maxPlace) * 100}%` }}></div>
              </div>
              <b>{n}</b>
            </div>
          ))
        )}
      </section>
    </>
  )
}