import { useEffect, useMemo, useState } from "react"
import { Icon, formatDate, todayString } from "../components.jsx"
import { useStored } from "../useStored.js"

const CHECKLIST = [
  "Research the company and its products",
  "Re-read the job description",
  "Prepare your 60-second introduction",
  "Write down 3 STAR stories",
  "Prepare 3 questions to ask them",
  "Check the time, place or video link",
  "Plan your outfit and what to carry"
]

const QUESTIONS = [
  ["Tell me about yourself.", "Keep it to a minute: present, past, then why this role."],
  ["Why do you want to work here?", "Mention one specific thing about the company, not generic praise."],
  ["What is your biggest strength?", "Pick one that fits the job and back it with a short example."],
  ["What is a weakness you are working on?", "Name a real one and the steps you are taking to improve."],
  ["Describe a time you solved a hard problem.", "Use STAR: situation, task, action, result."],
  ["Tell me about a mistake and what you learned.", "Own it, show the fix, and end on the lesson."],
  ["How do you handle tight deadlines?", "Explain how you prioritise, with a real example."],
  ["Describe a conflict with a teammate.", "Focus on listening and the outcome, not on blame."],
  ["Where do you see yourself in five years?", "Link your growth to what this role can offer."],
  ["Why should we hire you?", "Match two of their needs to two of your proven results."],
  ["What are your salary expectations?", "Research the range first and give a range, not one number."],
  ["Do you have any questions for us?", "Always ask something: the team, success in 90 days, next steps."]
]

const BLANK = { title: "", s: "", t: "", a: "", r: "" }

function countdown(dateStr, now, today) {
  const diff = new Date(dateStr + "T00:00:00").getTime() - now
  if (diff <= 0) return { state: dateStr === today ? "today" : "past" }
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor(diff / 3600000) % 24,
    m: Math.floor(diff / 60000) % 60,
    s: Math.floor(diff / 1000) % 60
  }
}

export default function Prep({ applications, openNew, onEdit }) {
  const [store, setStore] = useStored("cf-prep", {})
  const [selectedId, setSelectedId] = useState("")
  const [now, setNow] = useState(Date.now())
  const [qi, setQi] = useState(0)
  const [showTip, setShowTip] = useState(false)
  const [draft, setDraft] = useState(BLANK)

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const today = todayString()

  const sorted = useMemo(() => {
    const key = (a) => (a.interviewDate && a.interviewDate >= today ? a.interviewDate : "9999")
    return applications
      .filter((a) => a.status !== "Rejected")
      .sort((a, b) => key(a).localeCompare(key(b)))
  }, [applications, today])

  const app = sorted.find((a) => a._id === selectedId) || sorted[0]

  if (!app) {
    return (
      <>
        <div className="page-head">
          <div>
            <h1>Prep room</h1>
            <p>Get ready for each interview in one place.</p>
          </div>
        </div>
        <div className="empty">
          <div className="empty-icon"><Icon name="book" size={26} /></div>
          <h3>Nothing to prepare for yet</h3>
          <p>Add an application and it will appear here with its own checklist and countdown.</p>
          <button className="btn primary" onClick={openNew}>Add application</button>
        </div>
      </>
    )
  }

  const data = store[app._id] || {}
  const checks = data.checks || {}
  const stories = data.stories || []
  const update = (patch) => setStore({ ...store, [app._id]: { ...data, ...patch } })

  const doneCount = CHECKLIST.filter((_, i) => checks[i]).length
  const pct = Math.round((doneCount / CHECKLIST.length) * 100)
  const cd = app.interviewDate ? countdown(app.interviewDate, now, today) : null
  const [question, tip] = QUESTIONS[qi]

  const addStory = (e) => {
    e.preventDefault()
    if (!draft.title.trim()) return
    update({ stories: [...stories, draft] })
    setDraft(BLANK)
  }

  const field = (k) => ({
    value: draft[k],
    onChange: (e) => setDraft({ ...draft, [k]: e.target.value })
  })

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Prep room</h1>
          <p>Get ready for each interview in one place.</p>
        </div>
      </div>

      <div className="pr-wrap">
        <div>
          <section className="panel">
            <select className="pr-select" value={app._id} onChange={(e) => setSelectedId(e.target.value)}
              aria-label="Choose application">
              {sorted.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.company} - {a.role}
                  {a.interviewDate ? " (" + formatDate(a.interviewDate) + ")" : ""}
                </option>
              ))}
            </select>

            {!app.interviewDate ? (
              <p className="rd-hint" style={{ marginTop: 0 }}>
                No interview date yet.{" "}
                <button className="btn small" onClick={() => onEdit(app)}>Add a date</button>
              </p>
            ) : cd.state === "today" ? (
              <div className="cd-msg">Interview day. You have got this!</div>
            ) : cd.state === "past" ? (
              <div className="cd-msg">This interview date has passed.</div>
            ) : (
              <div className="cd">
                {[["days", cd.d], ["hours", cd.h], ["min", cd.m], ["sec", cd.s]].map(([label, v]) => (
                  <div className="cd-box" key={label}>
                    <strong>{String(v).padStart(2, "0")}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="panel">
            <h3>Prep checklist ({doneCount}/{CHECKLIST.length})</h3>
            <div className="pr-bar"><i style={{ width: pct + "%" }}></i></div>
            <ul className="check-list">
              {CHECKLIST.map((item, i) => (
                <li key={item}>
                  <label>
                    <input type="checkbox" checked={!!checks[i]}
                      onChange={() => update({ checks: { ...checks, [i]: !checks[i] } })} />
                    <span className={checks[i] ? "ticked" : ""}>{item}</span>
                  </label>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div>
          <section className="panel">
            <h3>Practice question</h3>
            <div className="fc">
              <small>Question {qi + 1} of {QUESTIONS.length}</small>
              <h4>{question}</h4>
              {showTip && <p>{tip}</p>}
              <div className="fc-actions">
                <button className="btn small" onClick={() => setShowTip(!showTip)}>
                  {showTip ? "Hide tip" : "Show tip"}
                </button>
                <button className="btn small primary"
                  onClick={() => { setQi((qi + 1) % QUESTIONS.length); setShowTip(false) }}>
                  Next question
                </button>
              </div>
            </div>
          </section>

          <section className="panel">
            <h3>Your STAR stories</h3>
            <form className="star-form" onSubmit={addStory}>
              <input placeholder="Story title, e.g. Fixed a failing release" {...field("title")} />
              <textarea rows="2" placeholder="Situation: what was happening?" {...field("s")} />
              <textarea rows="2" placeholder="Task: what was your responsibility?" {...field("t")} />
              <textarea rows="2" placeholder="Action: what did you do?" {...field("a")} />
              <textarea rows="2" placeholder="Result: what changed because of it?" {...field("r")} />
              <button className="btn primary small" type="submit">
                <Icon name="plus" size={14} /> Save story
              </button>
            </form>

            {stories.length > 0 && (
              <ul className="stories">
                {stories.map((st, i) => (
                  <li key={i}>
                    <details>
                      <summary>{st.title}</summary>
                      <p><b>Situation:</b> {st.s}</p>
                      <p><b>Task:</b> {st.t}</p>
                      <p><b>Action:</b> {st.a}</p>
                      <p><b>Result:</b> {st.r}</p>
                      <button className="btn small danger" style={{ marginTop: 8 }}
                        onClick={() => update({ stories: stories.filter((_, j) => j !== i) })}>
                        Remove
                      </button>
                    </details>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  )
}