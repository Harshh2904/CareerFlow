import { useEffect, useState } from "react"
import { Icon, STAGES, todayString } from "./components.jsx"

const MAX_PAST_DAYS = 365
const MAX_FUTURE_DAYS = 365

const EMPTY = {
  company: "", role: "", date: "", status: "Applied",
  location: "", jobLink: "", notes: "", interviewDate: ""
}

export default function Drawer({ application, onClose, onSave }) {
  const [f, setF] = useState(
    application
      ? Object.fromEntries(Object.keys(EMPTY).map((k) => [k, application[k] || EMPTY[k]]))
      : EMPTY
  )
  const [errors, setErrors] = useState({})

  const today = todayString()
  const earliest = todayString(MAX_PAST_DAYS)
  const latest = todayString(-MAX_FUTURE_DAYS)

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const bind = (k) => ({
    id: k,
    value: f[k],
    onChange: (e) => {
      setF({ ...f, [k]: e.target.value })
      if (errors[k]) setErrors({ ...errors, [k]: "" })
    }
  })

  const validate = () => {
    const e = {}

    if (!f.company.trim()) e.company = "Enter the company name."
    if (!f.role.trim()) e.role = "Enter the job role."

    if (!f.date) {
      e.date = "Pick the application date."
    } else if (f.date > today) {
      e.date = "Not applicable: the application date can't be in the future."
    } else if (f.date < earliest && (!application || f.date !== application.date)) {
      e.date = "Not applicable: that is more than a year ago."
    }

    if (f.interviewDate) {
      if (f.date && f.interviewDate < f.date) {
        e.interviewDate = "Not applicable: the interview can't be before the application date."
      } else if (f.interviewDate > latest) {
        e.interviewDate = "Not applicable: that is more than a year ahead."
      }
    }

    return e
  }

  const submit = (event) => {
    event.preventDefault()
    const found = validate()
    setErrors(found)

    if (Object.values(found).some(Boolean)) return

    onSave({ ...f, company: f.company.trim(), role: f.role.trim() })
  }

  const fieldClass = (k) => (errors[k] ? "field bad" : "field")
  const showError = (k) =>
    errors[k] ? <small className="err" role="alert">{errors[k]}</small> : null

  return (
    <div className="scrim" onClick={onClose}>
      <aside className="drawer" role="dialog" aria-modal="true"
        aria-label={application ? "Edit application" : "New application"}
        onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <h2>{application ? "Edit application" : "New application"}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </div>

        <form onSubmit={submit} noValidate>
          <div className={fieldClass("company")}>
            <label htmlFor="company">Company *</label>
            <input type="text" placeholder="e.g. Zoho" autoFocus {...bind("company")} />
            {showError("company")}
          </div>

          <div className={fieldClass("role")}>
            <label htmlFor="role">Job role *</label>
            <input type="text" placeholder="e.g. Software Developer" {...bind("role")} />
            {showError("role")}
          </div>

          <div className="two">
            <div className={fieldClass("date")}>
              <label htmlFor="date">Application date *</label>
              <input type="date" min={earliest} max={today} {...bind("date")} />
              {showError("date")}
            </div>
            <div className="field">
              <label htmlFor="status">Status</label>
              <select {...bind("status")}>
                {STAGES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="two">
            <div className="field">
              <label htmlFor="location">Location</label>
              <input type="text" placeholder="Chennai or Remote" {...bind("location")} />
            </div>
            <div className={fieldClass("interviewDate")}>
              <label htmlFor="interviewDate">Interview date</label>
              <input type="date" min={f.date || earliest} max={latest} {...bind("interviewDate")} />
              {showError("interviewDate")}
            </div>
          </div>

          <div className="field">
            <label htmlFor="jobLink">Job posting link</label>
            <input type="url" placeholder="https://company.com/job" {...bind("jobLink")} />
          </div>

          <div className="field">
            <label htmlFor="notes">Notes</label>
            <textarea rows="4" placeholder="Recruiter notes, interview rounds, preparation" {...bind("notes")}></textarea>
          </div>

          <div className="drawer-foot">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary">
              {application ? "Save changes" : "Save application"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  )
}