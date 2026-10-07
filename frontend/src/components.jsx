export const STAGES = ["Applied", "Interview", "Offer", "Rejected"]

const icons = {
  plus: "M12 5v14M5 12h14",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3",
  sun: "M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  moon: "M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z",
  link: "M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
  edit: "M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V4h6v3",
  close: "M6 6l12 12M18 6 6 18",
  pin: "M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  cal: "M4 7h16v13H4zM4 11h16M8 3v4M16 3v4",
  home: "M3 11l9-8 9 8M5 10v10h14V10",
  dash: "M4 4h7v7H4zM13 4h7v4h-7zM13 11h7v9h-7zM4 14h7v6H4z",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  board: "M4 4h5v16H4zM10 4h5v10h-5zM16 4h4v13h-4z",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  left: "M15 6l-6 6 6 6",
  right: "M9 6l6 6-6 6",
  funnel: "M3 4h18l-7 9v6l-4 2v-8z",
  match: "M9 12l2 2 4-4M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 4-6 8-6s8 2 8 6",
  book: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM19 19H6a2 2 0 0 0-2 2",
  target: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 12h.01",
  trend: "M3 17l6-6 4 4 8-8M15 7h6v6",
  flame: "M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z",
  check: "M5 12l5 5 9-10",
  chevron: "M6 9l6 6 6-6"
}

export function Icon({ name, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={icons[name]} />
    </svg>
  )
}

export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric", timeZone: "UTC"
      })
    : ""

export const todayString = (offset = 0) => {
  const d = new Date()
  d.setDate(d.getDate() - offset)
  return (
    d.getFullYear() + "-" +
    String(d.getMonth() + 1).padStart(2, "0") + "-" +
    String(d.getDate()).padStart(2, "0")
  )
}

export function ApplicationCard({ application, onEdit, onDelete }) {
  return (
    <li className={`card ${application.status?.toLowerCase()}`}>
      <div className="avatar">{application.company?.charAt(0).toUpperCase()}</div>
      <div className="card-main">
        <div className="card-title">
          <div>
            <h3>{application.role}</h3>
            <p>{application.company}</p>
          </div>
          <span className="tag">{application.status}</span>
        </div>
        <div className="meta">
          <span><Icon name="cal" size={14} /> Applied {formatDate(application.date)}</span>
          {application.location && (
            <span><Icon name="pin" size={14} /> {application.location}</span>
          )}
          {application.interviewDate && (
            <span className="meta-hot">Interview {formatDate(application.interviewDate)}</span>
          )}
        </div>
        {application.notes && <p className="note">{application.notes}</p>}
        <div className="card-actions">
          {application.jobLink && (
            <a className="btn small" href={application.jobLink} target="_blank" rel="noreferrer">
              <Icon name="link" size={14} /> Open job
            </a>
          )}
          <button className="btn small" onClick={() => onEdit(application)}>
            <Icon name="edit" size={14} /> Edit
          </button>
          <button className="btn small danger" onClick={() => onDelete(application._id)}>
            <Icon name="trash" size={14} /> Delete
          </button>
        </div>
      </div>
    </li>
  )
}