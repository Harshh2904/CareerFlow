import { Icon, formatDate, STAGES } from "../components.jsx"

export default function Board({ applications, counts, onEdit, onStatusChange, openNew }) {
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Board</h1>
          <p>Move each application forward as things progress.</p>
        </div>
        <button className="btn primary" onClick={openNew}>
          <Icon name="plus" size={16} /> New application
        </button>
      </div>

      <div className="board">
        {STAGES.map((stage, i) => (
          <section key={stage} className={`col ${stage.toLowerCase()}`}>
            <div className="col-head">
              <span>{stage}</span>
              <b>{counts[stage]}</b>
            </div>

            {applications.filter((a) => a.status === stage).map((a) => (
              <article className="bcard" key={a._id}>
                <h4>{a.role}</h4>
                <p>{a.company}</p>
                <small>
                  {a.interviewDate ? `Interview ${formatDate(a.interviewDate)}` : `Applied ${formatDate(a.date)}`}
                </small>
                <div className="bcard-actions">
                  <button className="btn" disabled={i === 0}
                    aria-label={`Move to ${STAGES[i - 1]}`}
                    onClick={() => onStatusChange(a, STAGES[i - 1])}>
                    <Icon name="left" size={14} />
                  </button>
                  <button className="btn" disabled={i === STAGES.length - 1}
                    aria-label={`Move to ${STAGES[i + 1]}`}
                    onClick={() => onStatusChange(a, STAGES[i + 1])}>
                    <Icon name="right" size={14} />
                  </button>
                  <span className="spacer"></span>
                  <button className="btn" onClick={() => onEdit(a)} aria-label="Edit">
                    <Icon name="edit" size={14} />
                  </button>
                </div>
              </article>
            ))}

            {counts[stage] === 0 && <p className="panel-empty">Nothing here yet.</p>}
          </section>
        ))}
      </div>
    </>
  )
}