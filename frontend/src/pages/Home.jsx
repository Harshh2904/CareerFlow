import { Icon } from "../components.jsx"

const chips = [
  { company: "Northwind", role: "Frontend Developer", status: "Interview" },
  { company: "Lumen Labs", role: "React Engineer", status: "Applied" },
  { company: "Brightpath", role: "UI Engineer", status: "Offer" }
]

const tiles = [
  { to: "/dashboard", title: "Dashboard", text: "Today's interviews, follow-ups and your latest activity.", icon: "dash", tone: "applied" },
  { to: "/applications", title: "Applications", text: "Search, filter and edit every role you've applied to.", icon: "list", tone: "interview" },
  { to: "/board", title: "Board", text: "Move applications from stage to stage in one click.", icon: "board", tone: "offer" },
  { to: "/insights", title: "Insights", text: "See your response rate, monthly pace and top locations.", icon: "chart", tone: "rejected" }
]

const steps = [
  ["Add the role", "Save the company, link, date and any notes the moment you apply."],
  ["Move it forward", "Update the stage as recruiters reply, and set the interview date."],
  ["Learn from the numbers", "Check which weeks and places get you the most replies."]
]

export default function Home({ total, counts, openNew }) {
  return (
    <>
      <section className="hero-home">
        <div className="hero-copy">
          <h1>Every application, from first click to signed offer.</h1>
          <p>
            CareerFlow keeps your roles, interview dates and follow-ups in one
            place, so nothing slips while you search.
          </p>

          <div className="hero-actions">
            <a className="btn primary big" href="#/dashboard">
              Open dashboard
            </a>
            <button className="btn big" onClick={openNew}>
              <Icon name="plus" size={16} /> Add application
            </button>
          </div>

          <dl className="hero-stats">
            <div>
              <dt>Tracked</dt>
              <dd>{total}</dd>
            </div>
            <div>
              <dt>Interviews</dt>
              <dd>{counts.Interview}</dd>
            </div>
            <div>
              <dt>Offers</dt>
              <dd>{counts.Offer}</dd>
            </div>
          </dl>
        </div>

        <div className="stack" aria-hidden="true">
          {chips.map((c) => (
            <div key={c.company} className={"chip " + c.status.toLowerCase()}>
              <span className="mini">{c.company.charAt(0)}</span>
              <div>
                <strong>{c.role}</strong>
                <small>{c.company}</small>
              </div>
              <em>{c.status}</em>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">Everything for the search, in four places</h2>
        <div className="tiles">
          {tiles.map((t) => (
            <a key={t.to} href={"#" + t.to} className={"tile " + t.tone}>
              <Icon name={t.icon} size={28} />
              <div>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">How it works</h2>
        <ol className="steps">
          {steps.map(([title, text], i) => (
            <li key={title}>
              <span className="step-n">{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="cta">
        <h2>Ready to track your next application?</h2>
        <button className="btn pop big" onClick={openNew}>
          <Icon name="plus" size={16} /> Add application
        </button>
      </section>
    </>
  )
}