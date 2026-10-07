import { Icon } from "../components.jsx"
import { useStored } from "../useStored.js"
import "../resume.css"

const EMPTY = {
  name: "", headline: "", email: "", phone: "", location: "",
  summary: "", skills: "", experience: [], education: []
}

const cleanPhone = (value) => {
  let digits = value.replace(/\D/g, "")
  if (digits.length > 10 && digits.startsWith("91")) digits = digits.slice(2)
  return digits.slice(0, 10)
}

const bullets = (text) =>
  (text || "").split("\n").map((s) => s.trim()).filter(Boolean)

export default function Profile() {
  const [p, setP] = useStored("cf-profile", EMPTY)
  const experience = p.experience || []
  const education = p.education || []
  const phone = p.phone || ""
  const canSave = Boolean((p.name || "").trim())

  const set = (k) => (e) => setP({ ...p, [k]: e.target.value })
  const setItem = (list, i, k, v) =>
    setP({ ...p, [list]: (p[list] || []).map((x, j) => (j === i ? { ...x, [k]: v } : x)) })
  const addItem = (list, blank) => setP({ ...p, [list]: [...(p[list] || []), blank] })
  const removeItem = (list, i) =>
    setP({ ...p, [list]: (p[list] || []).filter((_, j) => j !== i) })

  const skills = (p.skills || "").split(",").map((s) => s.trim()).filter(Boolean)
  const parts = [p.name, p.headline, p.email, p.summary, p.skills,
    experience.length ? "x" : "", education.length ? "x" : ""]
  const strength = Math.round((parts.filter(Boolean).length / parts.length) * 100)

  const printResume = () => {
    const oldTitle = document.title
    const safe = (p.name || "").trim().replace(/[^a-z0-9]+/gi, "_")
    document.title = (safe || "Resume") + "_Resume"

    const restore = () => {
      document.title = oldTitle
      window.removeEventListener("afterprint", restore)
    }
    window.addEventListener("afterprint", restore)

    window.print()
  }

  const contact = [p.email, phone, p.location].filter(Boolean).join("  |  ")

  return (
    <>
      <div className="page-head no-print">
        <div>
          <h1>Profile and resume</h1>
          <p>Fill in your details and your resume builds itself on the right.</p>
        </div>
        <button
          type="button"
          className="btn primary"
          disabled={!canSave}
          title={canSave ? "Save your resume as a PDF" : "Enter your name first"}
          onClick={printResume}
        >
          Download PDF
        </button>
      </div>

      <p className="rd-hint no-print" style={{ marginTop: 0 }}>
        {canSave
          ? "In the print window, set Destination to Save as PDF and turn off Headers and footers, then click Save."
          : "Enter your full name below to enable the Download PDF button."}
      </p>

      <div className="pf-strength no-print">
        <span>Profile strength {strength}%</span>
        <div><i style={{ width: strength + "%" }}></i></div>
      </div>

      <div className="pf-wrap">
        <form className="panel pf-form no-print" onSubmit={(e) => e.preventDefault()}>
          <h3>About you</h3>
          <div className="field">
            <label>Full name</label>
            <input value={p.name} onChange={set("name")} placeholder="e.g. Priya Kumar" />
          </div>
          <div className="field">
            <label>Headline</label>
            <input value={p.headline} onChange={set("headline")} placeholder="e.g. Frontend Developer" />
          </div>
          <div className="two">
            <div className="field">
              <label>Email</label>
              <input type="email" value={p.email} onChange={set("email")} placeholder="you@email.com" />
            </div>
            <div className={phone && phone.length < 10 ? "field bad" : "field"}>
              <label>Phone (10 digits)</label>
              <input
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setP({ ...p, phone: cleanPhone(e.target.value) })}
                placeholder="9876543210"
              />
              {phone && phone.length < 10 && (
                <small className="err">Enter all 10 digits ({phone.length}/10).</small>
              )}
            </div>
          </div>
          <div className="field">
            <label>Location</label>
            <input value={p.location} onChange={set("location")} placeholder="Erode, Tamil Nadu" />
          </div>
          <div className="field">
            <label>Summary</label>
            <textarea rows="4" value={p.summary} onChange={set("summary")}
              placeholder="Two or three lines about what you do and what you want next." />
          </div>
          <div className="field">
            <label>Skills (separated by commas)</label>
            <input value={p.skills} onChange={set("skills")} placeholder="React, JavaScript, Node.js, MongoDB" />
          </div>

          <h3>Experience</h3>
          {experience.map((x, i) => (
            <div className="pf-item" key={i}>
              <input value={x.title} onChange={(e) => setItem("experience", i, "title", e.target.value)} placeholder="Job title" />
              <input value={x.company} onChange={(e) => setItem("experience", i, "company", e.target.value)} placeholder="Company" />
              <input value={x.period} onChange={(e) => setItem("experience", i, "period", e.target.value)} placeholder="Jan 2024 - Present" />
              <textarea rows="3" value={x.details} onChange={(e) => setItem("experience", i, "details", e.target.value)} placeholder="One achievement per line" />
              <button type="button" className="btn small danger" onClick={() => removeItem("experience", i)}>Remove</button>
            </div>
          ))}
          <button type="button" className="btn small"
            onClick={() => addItem("experience", { title: "", company: "", period: "", details: "" })}>
            <Icon name="plus" size={14} /> Add experience
          </button>

          <h3>Education</h3>
          {education.map((x, i) => (
            <div className="pf-item" key={i}>
              <input value={x.degree} onChange={(e) => setItem("education", i, "degree", e.target.value)} placeholder="Degree" />
              <input value={x.school} onChange={(e) => setItem("education", i, "school", e.target.value)} placeholder="College or school" />
              <input value={x.period} onChange={(e) => setItem("education", i, "period", e.target.value)} placeholder="2020 - 2024" />
              <button type="button" className="btn small danger" onClick={() => removeItem("education", i)}>Remove</button>
            </div>
          ))}
          <button type="button" className="btn small"
            onClick={() => addItem("education", { degree: "", school: "", period: "" })}>
            <Icon name="plus" size={14} /> Add education
          </button>
        </form>

        <article className="resume">
          <header>
            <h2>{p.name || "Your Name"}</h2>
            {p.headline && <p className="rs-head">{p.headline}</p>}
            {contact && <p className="rs-contact">{contact}</p>}
          </header>

          {p.summary && (
            <section>
              <h3>Professional Summary</h3>
              <p>{p.summary}</p>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h3>Skills</h3>
              <p>{skills.join(", ")}</p>
            </section>
          )}

          {experience.length > 0 && (
            <section>
              <h3>Work Experience</h3>
              {experience.map((x, i) => (
                <div className="rs-item" key={i}>
                  <div className="rs-row">
                    <span><b>{x.title}</b>{x.company ? ", " + x.company : ""}</span>
                    <span>{x.period}</span>
                  </div>
                  {bullets(x.details).length > 0 && (
                    <ul className="rs-list">
                      {bullets(x.details).map((line, j) => <li key={j}>{line}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {education.length > 0 && (
            <section>
              <h3>Education</h3>
              {education.map((x, i) => (
                <div className="rs-item" key={i}>
                  <div className="rs-row">
                    <span><b>{x.degree}</b>{x.school ? ", " + x.school : ""}</span>
                    <span>{x.period}</span>
                  </div>
                </div>
              ))}
            </section>
          )}
        </article>
      </div>
    </>
  )
}