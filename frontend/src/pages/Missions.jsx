import { useEffect } from "react"
import { Icon, todayString } from "../components.jsx"
import { useStored } from "../useStored.js"

const daysSince = (d) =>
  Math.floor((Date.now() - new Date(d + "T00:00:00").getTime()) / 86400000)

export default function Missions({ applications, openNew }) {
  const today = todayString()
  const [state, setState] = useStored("cf-missions", { date: today, done: {} })
  const [days, setDays] = useStored("cf-mission-days", [])

  const done = state.date === today ? state.done : {}
  const toggle = (id) => setState({ date: today, done: { ...done, [id]: !done[id] } })

  const stale = applications
    .filter((a) => a.status === "Applied" && a.date && daysSince(a.date) >= 7)
    .sort((a, b) => a.date.localeCompare(b.date))[0]

  const appliedToday = applications.filter((a) => a.date === today).length

  const missions = [
    {
      id: "apply",
      title: "Apply to 2 roles",
      detail: Math.min(appliedToday, 2) + " of 2 added today",
      auto: appliedToday >= 2,
      action: <button className="btn small" onClick={openNew}>Add</button>
    },
    {
      id: "follow",
      title: stale ? "Follow up with " + stale.company : "Send one networking message",
      detail: stale
        ? "Waiting " + daysSince(stale.date) + " days for a reply"
        : "Reach out to one person in your field",
      action: <a className="btn small" href="#/applications">Open list</a>
    },
    {
      id: "learn",
      title: "Spend 20 minutes learning",
      detail: "Practice a skill or review interview answers",
      action: <a className="btn small" href="#/growth">Open Growth</a>
    }
  ]

  const isDone = (m) => m.auto || done[m.id]
  const count = missions.filter(isDone).length
  const allDone = count === missions.length

  useEffect(() => {
    if (allDone) setDays((list) => (list.includes(today) ? list : [...list, today]))
  }, [allDone, today])

  let start = days.includes(todayString()) ? 0 : 1
  let streak = 0
  while (days.includes(todayString(start + streak))) streak++

  const week = [6, 5, 4, 3, 2, 1, 0].map((o) => {
    const date = todayString(o)
    return {
      date,
      on: days.includes(date),
      label: new Date(date + "T00:00:00").toLocaleDateString("en-US", { weekday: "narrow" })
    }
  })

  const message =
    count === 3
      ? "All missions done. Your streak is safe."
      : count === 0
      ? "Three small tasks. Start with the easiest."
      : 3 - count + " to go. Keep the momentum."

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Daily missions</h1>
          <p>Three small tasks each day keep the search moving.</p>
        </div>
      </div>

      <div className="ms-top">
        <section className="ms-card">
          <svg className="ring" viewBox="0 0 100 100" role="img" aria-label={count + " of 3 missions done"}>
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="10" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--offer)" strokeWidth="10"
              strokeLinecap="round" strokeDasharray={(count / 3) * 264 + " 264"}
              transform="rotate(-90 50 50)" />
            <text x="50" y="57" textAnchor="middle" className="ring-t">{count}/3</text>
          </svg>
          <div>
            <h2>Today</h2>
            <p>{message}</p>
          </div>
        </section>

        <section className="streak">
          <div className="streak-num">
            <Icon name="flame" size={34} />
            <strong>{streak}</strong>
            <span>day streak</span>
          </div>
          <div className="dots">
            {week.map((d) => (
              <div key={d.date} className={d.on ? "on" : ""}>
                <i></i>
                {d.label}
              </div>
            ))}
          </div>
        </section>
      </div>

      <ul className="ms-list">
        {missions.map((m) => (
          <li key={m.id} className={isDone(m) ? "ms done" : "ms"}>
            <button className="ms-check" disabled={m.auto}
              aria-pressed={!!isDone(m)} aria-label={"Mark done: " + m.title}
              onClick={() => toggle(m.id)}>
              {isDone(m) && <Icon name="check" size={18} />}
            </button>
            <div>
              <strong>{m.title}</strong>
              <small>{m.detail}</small>
            </div>
            {m.action}
          </li>
        ))}
      </ul>
    </>
  )
}