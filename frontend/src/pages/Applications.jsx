import { useMemo, useState } from "react"
import { Icon, ApplicationCard, STAGES } from "../components.jsx"

export default function Applications({
  applications, total, openNew, onEdit, onDelete, filterStatus, setFilterStatus
}) {
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const text = search.toLowerCase()
    return applications.filter((a) => {
      const matchesSearch =
        a.company?.toLowerCase().includes(text) ||
        a.role?.toLowerCase().includes(text) ||
        a.location?.toLowerCase().includes(text)
      return matchesSearch && (filterStatus === "All" || a.status === filterStatus)
    })
  }, [applications, search, filterStatus])

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Applications</h1>
          <p>{filtered.length} of {total} shown</p>
        </div>
        <button className="btn primary" onClick={openNew}>
          <Icon name="plus" size={16} /> New application
        </button>
      </div>

      <div className="toolbar">
        <label className="search">
          <Icon name="search" size={17} />
          <input type="text" placeholder="Search company, role or location"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          aria-label="Filter by status">
          <option>All</option>
          {STAGES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-icon"><Icon name="plus" size={26} /></div>
          <h3>{total === 0 ? "No applications yet" : "Nothing matches"}</h3>
          <p>
            {total === 0
              ? "Save the roles you apply to and follow each one from application to offer."
              : "Try a different search or clear the status filter."}
          </p>
          {total === 0 ? (
            <button className="btn primary" onClick={openNew}>Add your first application</button>
          ) : (
            <button className="btn" onClick={() => { setSearch(""); setFilterStatus("All") }}>
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <ul className="cards">
          {filtered.map((a) => (
            <ApplicationCard key={a._id} application={a} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </>
  )
}