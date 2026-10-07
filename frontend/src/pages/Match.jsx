import { useMemo, useState } from "react"
import { useStored } from "../useStored.js"

const STOP = new Set(
  "the and for with you our are will your have this that from they their about into more than who has all can any not but out per etc using work team role job years year experience ability strong skills including such other must new well also looking join help make across able both each".split(" ")
)

export default function Match() {
  const [profile] = useStored("cf-profile", {})
  const [jd, setJd] = useState("")

  const mine = [
    profile.skills,
    profile.summary,
    ...(profile.experience || []).map((x) => (x.title || "") + " " + (x.details || ""))
  ].join(" ").toLowerCase()

  const result = useMemo(() => {
    const words = jd.toLowerCase().match(/[a-z][a-z+#]{2,}/g) || []
    const freq = {}
    words.forEach((w) => {
      if (!STOP.has(w)) freq[w] = (freq[w] || 0) + 1
    })
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 16).map(([w]) => w)
    return {
      top,
      matched: top.filter((w) => mine.includes(w)),
      missing: top.filter((w) => !mine.includes(w))
    }
  }, [jd, mine])

  const pct = result.top.length ? Math.round((result.matched.length / result.top.length) * 100) : 0
  const verdict = pct >= 70 ? "Strong match. Apply with confidence." : pct >= 40 ? "Decent match. Add the missing keywords you genuinely have." : "Weak match. Tailor your resume or look for a closer role."

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Job match</h1>
          <p>Paste a job description to see how well your profile fits.</p>
        </div>
      </div>

      {!mine.trim() && (
        <p className="rd-hint">
          Your profile is empty. <a href="#/profile">Fill in your skills first</a> for an accurate result.
        </p>
      )}

      <div className="mt-wrap">
        <section className="panel">
          <h3>Job description</h3>
          <textarea className="mt-text" rows="14" value={jd} onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the full job description here..." />
        </section>

        <section className="panel">
          <h3>Result</h3>
          {result.top.length === 0 ? (
            <p className="panel-empty">Your match score will appear here.</p>
          ) : (
            <>
              <div className="mt-score">
                <strong>{pct}%</strong>
                <span>{verdict}</span>
              </div>
              <h4 className="mt-h">You have ({result.matched.length})</h4>
              <p className="mt-chips">
                {result.matched.map((w) => <span className="ok" key={w}>{w}</span>)}
              </p>
              <h4 className="mt-h">Missing ({result.missing.length})</h4>
              <p className="mt-chips">
                {result.missing.map((w) => <span className="no" key={w}>{w}</span>)}
              </p>
            </>
          )}
        </section>
      </div>
    </>
  )
}
