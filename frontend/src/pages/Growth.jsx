import { useState } from "react"
import { Icon } from "../components.jsx"
import { useStored } from "../useStored.js"

const mondayOf = (d) => {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7))
  return x
}

const levelName = (n) =>
  n < 25 ? "Beginner" : n < 50 ? "Learning" : n < 75 ? "Comfortable" : "Strong"

export default function Growth({ applications, total }) {
  const [skills, setSkills] = useStored("cf-skills", [])
  const [goals, setGoals] = useStored("cf-goals", [])
  const [days] = useStored("cf-mission-days", [])
  const [skillName, setSkillName] = useState("")
  const [goalText, setGoalText] = useState("")
  const [goalDate, setGoalDate] = useState("")

  const thisMonday = mondayOf(new Date())
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const start = new Date(thisMonday)
    start.setDate(start.getDate() - (7 - i) * 7)
    const end = new Date(start)
    end.setDate(end.getDate() + 7)
    return {
      label: start.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
      count: applications.filter((a) => {
        if (!a.date) return false
        const t = new Date(a.date + "T00:00:00")
        return t >= start && t < end
      }).length
    }
  })
  const maxWeek = Math.max(1, ...weeks.map((w) => w.count))

  const hours = skills.reduce((sum, s) => sum + (s.hours || 0), 0)
  const goalsDone = goals.filter((g) => g.done).length
  const goalPct = goals.length ? Math.round((goalsDone / goals.length) * 100) : 0

  const addSkill = (e) => {
    e.preventDefault()
    if (!skillName.trim()) return
    setSkills([...skills, { id: Date.now(), name: skillName.trim(), level: 10, hours: 0 }])
    setSkillName("")
  }

  const patchSkill = (id, patch) =>
    setSkills(skills.map((s) => (s.id === id ? { ...s, ...patch } : s)))

  const addGoal = (e) => {
    e.preventDefault()
    if (!goalText.trim()) return
    setGoals([...goals, { id: Date.now(), text: goalText.trim(), date: goalDate, done: false }])
    setGoalText("")
    setGoalDate("")
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Growth</h1>
          <p>Watch your effort and your skills add up over time.</p>
        </div>
      </div>

      <div className="gr-stats">
        <div className="kpi loud"><strong>{total}</strong><span>Applications sent</span></div>
        <div className="kpi"><strong>{skills.length}</strong><span>Skills tracked</span></div>
        <div className="kpi"><strong>{hours}</strong><span>Hours practiced</span></div>
        <div className="kpi"><strong>{days.length}</strong><span>Days with all missions done</span></div>
      </div>

      <section className="panel">
        <h3>Applications per week</h3>
        <div className="bars">
          {weeks.map((w) => (
            <div className="bar-col" key={w.label}>
              <b>{w.count}</b>
              <div className="bar" style={{ height: (w.count / maxWeek) * 100 + "%" }}></div>
              <span>{w.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="gr-grid">
        <section className="panel">
          <h3>Skills I am building</h3>
          <form className="sk-add" onSubmit={addSkill}>
            <input placeholder="e.g. React, SQL, public speaking" value={skillName}
              onChange={(e) => setSkillName(e.target.value)} />
            <button className="btn primary small" type="submit">
              <Icon name="plus" size={14} /> Add
            </button>
          </form>

          {skills.length === 0 && (
            <p className="panel-empty">Add a skill you are learning and track your level and practice hours.</p>
          )}

          {skills.map((s) => (
            <div className="sk-row" key={s.id}>
              <div className="sk-head">
                <strong>{s.name}</strong>
                <small>{levelName(s.level)} · {s.level}%</small>
              </div>
              <input type="range" min="0" max="100" value={s.level}
                aria-label={s.name + " level"}
                onChange={(e) => patchSkill(s.id, { level: Number(e.target.value) })} />
              <div className="sk-tools">
                <span>{s.hours || 0} hours</span>
                <button className="btn small" onClick={() => patchSkill(s.id, { hours: (s.hours || 0) + 1 })}>
                  +1 hour
                </button>
                <button className="btn small danger" onClick={() => setSkills(skills.filter((x) => x.id !== s.id))}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </section>

        <section className="panel">
          <h3>Goals ({goalsDone}/{goals.length})</h3>
          <div className="pr-bar"><i style={{ width: goalPct + "%" }}></i></div>
          <form className="gl-add" onSubmit={addGoal}>
            <input placeholder="e.g. Finish my portfolio site" value={goalText}
              onChange={(e) => setGoalText(e.target.value)} />
            <input type="date" value={goalDate} aria-label="Target date"
              onChange={(e) => setGoalDate(e.target.value)} />
            <button className="btn primary small" type="submit">
              <Icon name="plus" size={14} />
            </button>
          </form>

          {goals.length === 0 && (
            <p className="panel-empty">Set a goal with an optional target date and tick it off when done.</p>
          )}

          <ul className="gl-list">
            {goals.map((g) => (
              <li key={g.id}>
                <input type="checkbox" checked={g.done} aria-label={g.text}
                  onChange={() => setGoals(goals.map((x) => (x.id === g.id ? { ...x, done: !x.done } : x)))} />
                <span className={g.done ? "ticked" : ""}>{g.text}</span>
                {g.date && <small>{g.date}</small>}
                <button className="btn small danger" onClick={() => setGoals(goals.filter((x) => x.id !== g.id))}>
                  <Icon name="close" size={14} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}