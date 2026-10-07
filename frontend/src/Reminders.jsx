import { useEffect, useState } from "react"
import { todayString, formatDate } from "./components.jsx"

function Bell() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7zM10 20a2 2 0 0 0 4 0" />
    </svg>
  )
}

export default function Reminders({ applications, userId }) {
  const today = todayString()
  const tomorrow = todayString(-1)
  const hideKey = "cf-reminder-hidden-" + userId + "-" + today

  const [hidden, setHidden] = useState(() => sessionStorage.getItem(hideKey) === "1")
  const [permission, setPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "denied"
  )

  const items = applications
    .filter(
      (a) =>
        a.status !== "Rejected" &&
        (a.interviewDate === today || a.interviewDate === tomorrow)
    )
    .sort((a, b) => a.interviewDate.localeCompare(b.interviewDate))

  const summary = items
    .map((a) => (a.interviewDate === today ? "Today" : "Tomorrow") + ": " + a.company + " (" + a.role + ")")
    .join("\n")

  useEffect(() => {
    if (permission !== "granted" || items.length === 0) return

    const sentKey = "cf-notified-" + userId + "-" + today
    if (localStorage.getItem(sentKey)) return

    try {
      new Notification("CareerFlow interview reminder", { body: summary })
      localStorage.setItem(sentKey, "1")
    } catch (error) {
      /* notifications not supported */
    }
  }, [permission, summary, userId, today, items.length])

  if (hidden || items.length === 0) return null

  const dismiss = () => {
    sessionStorage.setItem(hideKey, "1")
    setHidden(true)
  }

  const enable = () => {
    Notification.requestPermission().then(setPermission)
  }

  return (
    <div className="reminder" role="status">
      <span className="rem-icon"><Bell /></span>

      <div className="rem-body">
        <strong>Interview reminder</strong>
        <ul>
          {items.map((a) => (
            <li key={a._id}>
              <b>{a.interviewDate === today ? "Today" : "Tomorrow"}</b>
              {" "}
              {a.company}, {a.role} ({formatDate(a.interviewDate)})
            </li>
          ))}
        </ul>
        <div className="rem-actions">
          <a className="btn small" href="#/prep">Open prep room</a>
          {permission === "default" && (
            <button className="btn small" onClick={enable}>Enable notifications</button>
          )}
        </div>
      </div>

      <button className="btn small" onClick={dismiss}>Dismiss</button>
    </div>
  )
}