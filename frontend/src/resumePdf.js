import { jsPDF } from "jspdf"

const INK = [27, 19, 64]
const GRAY = [93, 107, 133]
const VIOLET = [91, 61, 245]

export function downloadResume(p) {
  const doc = new jsPDF({ unit: "pt", format: "a4" })
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()
  const M = 48
  let y = M

  const text = (str, size, bold, color, gap) => {
    doc.setFont("helvetica", bold ? "bold" : "normal")
    doc.setFontSize(size)
    doc.setTextColor(color[0], color[1], color[2])
    const lines = doc.splitTextToSize(String(str), W - M * 2)
    lines.forEach((line) => {
      if (y + size * 1.4 > H - M) {
        doc.addPage()
        y = M
      }
      doc.text(line, M, y + size)
      y += size * 1.4
    })
    y += gap
  }

  const heading = (title) => {
    if (y > H - 90) {
      doc.addPage()
      y = M
    }
    y += 8
    text(title.toUpperCase(), 10.5, true, VIOLET, 2)
    doc.setDrawColor(VIOLET[0], VIOLET[1], VIOLET[2])
    doc.line(M, y, W - M, y)
    y += 8
  }

  const entry = (title, period) => {
    text(period ? title + "   |   " + period : title, 11, true, INK, 2)
  }

  const join = (a, b) => [a, b].filter(Boolean).join(", ")
  const skills = (p.skills || "").split(",").map((s) => s.trim()).filter(Boolean)
  const experience = p.experience || []
  const education = p.education || []
  const contact = [p.email, p.phone, p.location].filter(Boolean).join("   |   ")

  text(p.name || "Your Name", 24, true, INK, 2)
  if (p.headline) text(p.headline, 13, false, GRAY, 2)
  if (contact) text(contact, 10, false, GRAY, 6)

  if (p.summary) {
    heading("Summary")
    text(p.summary, 10.5, false, INK, 4)
  }

  if (skills.length > 0) {
    heading("Skills")
    text(skills.join(", "), 10.5, false, INK, 4)
  }

  if (experience.length > 0) {
    heading("Experience")
    experience.forEach((x) => {
      entry(join(x.title, x.company), x.period)
      if (x.details) text(x.details, 10.5, false, INK, 8)
    })
  }

  if (education.length > 0) {
    heading("Education")
    education.forEach((x) => {
      entry(join(x.degree, x.school), x.period)
      y += 6
    })
  }

  const safeName = (p.name || "resume").trim().replace(/[^a-z0-9]+/gi, "_")
  const fileName = safeName + "_Resume.pdf"

  const blob = new Blob([doc.output("arraybuffer")], { type: "application/pdf" })
  const url = URL.createObjectURL(blob)
  const tab = window.open(url, "_blank")

  if (!tab) {
    URL.revokeObjectURL(url)
    throw new Error("Pop-up blocked. Click the blocked icon at the right end of the address bar, choose Always allow, and try again.")
  }

  setTimeout(() => URL.revokeObjectURL(url), 120000)
  return fileName
}