import { formatDate, STAGES } from "../components.jsx"

const daysSince = (d) => Math.floor((Date.now() - new Date(d).getTime()) / 86400000)

function Panel({ title, items, empty }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {items.length === 0 ? (
        <p className="panel-empty">{empty}</p>
      ) : (
        <ul>
          {items.map(({ app, note }) => (
            <li className="row" key={app._id}>
              <span className={`mini ${app.status?.toLowerCase()}`}>
                {app.company?.charAt(0).toUpperCase()}
              </span>
              <div>
                <strong>{app.role}</strong>
                <small>{app.company}</small>
              </div>
              <span className="row-date">{note}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default function Dashboard({ applications, counts, total, goFilter }) {
  const today = new Date().toISOString().slice(0, 10)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
  const active = counts.Applied + counts.Interview

  const upcoming = applications
    .filter((a) => a.interviewDate && a.interviewDate >= today)
    .sort((a, b) => a.interviewDate.localeCompare(b.interviewDate))
    .slice(0, 4)
    .map((app) => ({ app, note: formatDate(app.interviewDate) }))

  const followUps = applications
    .filter((a) => a.status === "Applied" && a.date && daysSince(a.date) >= 7)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4)
    .map((app) => ({ app, note: `${daysSince(app.date)} days ago` }))

  const recent = [...applications]
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, 4)
    .map((app) => ({ app, note: formatDate(app.date) }))

  return (
    <>
      <section className="overview">
        <div className="overview-head">
          <div>
            <h1>{greeting}.</h1>
            <p>
              {total === 0
                ? "Add your first application to start tracking."
                : `${active} applications are still active.`}
            </p>
          </div>
          <div className="total">
            <strong>{total}</strong>
            <span>applications</span>
          </div>
        </div>

        <div className={`flow ${total === 0 ? "flow-empty" : ""}`}>
          {STAGES.map((stage) => (
            <button key={stage} className={`flow-seg ${stage.toLowerCase()}`}
              style={{ flexGrow: Math.max(counts[stage], 0.35) }}
              onClick={() => goFilter(stage)}>
              <span className="flow-count">{counts[stage]}</span>
              <span className="flow-label">{stage}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="dash-grid">
        <Panel title="Upcoming interviews" items={upcoming} empty="No interviews scheduled. Add an interview date to an application." />
        <Panel title="Time to follow up" items={followUps} empty="Nothing waiting more than a week." />
        <Panel title="Recently applied" items={recent} empty="Your latest applications will show here." />
      </div>
    </>
  )
}