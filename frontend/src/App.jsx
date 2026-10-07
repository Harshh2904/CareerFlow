import { useEffect, useState } from "react"
import "./App.css"
import "./pages.css"
import "./extra.css"
import "./auth.css"
import { Icon, STAGES } from "./components.jsx"
import Logo from "./Logo.jsx"
import Drawer from "./Drawer.jsx"
import Reminders from "./Reminders.jsx"
import { api } from "./api.js"
import { startSession, endSession, syncFromServer, pushNow } from "./storage.js"
import Auth from "./pages/Auth.jsx"
import Home from "./pages/Home.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import Applications from "./pages/Applications.jsx"
import Board from "./pages/Board.jsx"
import Insights from "./pages/Insights.jsx"
import Funnel from "./pages/Funnel.jsx"
import Match from "./pages/Match.jsx"
import Profile from "./pages/Profile.jsx"
import Prep from "./pages/Prep.jsx"
import Missions from "./pages/Missions.jsx"
import Growth from "./pages/Growth.jsx"

const SESSION_KEY = "cf-session"

const MAIN = [
  ["/", "Home", "home"],
  ["/dashboard", "Dashboard", "dash"],
  ["/applications", "Applications", "list"],
  ["/board", "Board", "board"],
  ["/insights", "Insights", "chart"]
]

const TOOLS = [
  ["/funnel", "Funnel", "funnel"],
  ["/match", "Match", "match"],
  ["/prep", "Prep room", "book"],
  ["/missions", "Missions", "target"],
  ["/growth", "Growth", "trend"]
]

const PROFILE = ["/profile", "Profile", "user"]
const NAV = [...MAIN, ...TOOLS, PROFILE]

const PAGES = {
  "/": Home,
  "/dashboard": Dashboard,
  "/applications": Applications,
  "/board": Board,
  "/insights": Insights,
  "/funnel": Funnel,
  "/match": Match,
  "/prep": Prep,
  "/missions": Missions,
  "/growth": Growth,
  "/profile": Profile
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4M16 8l4 4-4 4M20 12H9" />
    </svg>
  )
}

function useRoute() {
  const read = () => window.location.hash.replace(/^#/, "") || "/"
  const [route, setRoute] = useState(read)

  useEffect(() => {
    const onChange = () => {
      setRoute(read())
      window.scrollTo(0, 0)
    }
    window.addEventListener("hashchange", onChange)
    return () => window.removeEventListener("hashchange", onChange)
  }, [])

  return route
}

function readSession() {
  try {
    const saved = JSON.parse(localStorage.getItem(SESSION_KEY))
    return saved && saved.token && saved.user ? saved : null
  } catch (error) {
    return null
  }
}

function Workspace({ session, onLogout, darkMode, setDarkMode }) {
  const { token, user } = session
  const route = useRoute()
  const [applications, setApplications] = useState([])
  const [drawer, setDrawer] = useState(null)
  const [filterStatus, setFilterStatus] = useState("All")
  const [notice, setNotice] = useState("")
  const [toolsOpen, setToolsOpen] = useState(false)

  useEffect(() => {
    loadApplications()
  }, [])

  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setNotice(""), 3000)
    return () => clearTimeout(timer)
  }, [notice])

  useEffect(() => {
    setToolsOpen(false)
  }, [route])

  useEffect(() => {
    if (!toolsOpen) return

    const onDown = (e) => {
      if (!e.target.closest(".menu")) setToolsOpen(false)
    }
    const onKey = (e) => {
      if (e.key === "Escape") setToolsOpen(false)
    }

    document.addEventListener("mousedown", onDown)
    window.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDown)
      window.removeEventListener("keydown", onKey)
    }
  }, [toolsOpen])

  const fail = (error) => {
    if (error.status === 401) {
      onLogout("Your session expired. Please log in again.")
      return
    }
    setNotice(error.message || "Something went wrong.")
  }

  const loadApplications = async () => {
    try {
      setApplications(await api("/applications", { token }))
    } catch (error) {
      fail(error)
    }
  }

  const handleSave = async (data) => {
    const editing = drawer && drawer.application

    try {
      const saved = await api(
        editing ? "/applications/" + editing._id : "/applications",
        { method: editing ? "PUT" : "POST", body: data, token }
      )

      setApplications((current) =>
        editing
          ? current.map((a) => (a._id === editing._id ? saved : a))
          : [saved, ...current]
      )
      setNotice(editing ? "Application updated successfully." : "Application added successfully.")
      setDrawer(null)
    } catch (error) {
      fail(error)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return

    try {
      await api("/applications/" + id, { method: "DELETE", token })
      setApplications((current) => current.filter((a) => a._id !== id))
      setNotice("Application deleted.")
    } catch (error) {
      fail(error)
    }
  }

  const handleStatusChange = async (application, status) => {
    try {
      const saved = await api("/applications/" + application._id, {
        method: "PUT",
        body: { ...application, status },
        token
      })
      setApplications((current) => current.map((a) => (a._id === saved._id ? saved : a)))
      setNotice("Moved to " + status + ".")
    } catch (error) {
      fail(error)
    }
  }

  const goFilter = (stage) => {
    setFilterStatus(stage)
    window.location.hash = "/applications"
  }

  const counts = STAGES.reduce((acc, stage) => {
    acc[stage] = applications.filter((a) => a.status === stage).length
    return acc
  }, {})

  const Page = PAGES[route] || Home
  const toolsActive = TOOLS.some(([path]) => path === route)

  const pageProps = {
    applications,
    counts,
    total: applications.length,
    openNew: () => setDrawer({ application: null }),
    onEdit: (application) => setDrawer({ application }),
    onDelete: handleDelete,
    onStatusChange: handleStatusChange,
    goFilter,
    filterStatus,
    setFilterStatus
  }

  const link = ([path, label, icon]) => (
    <a key={path} href={"#" + path} className={route === path ? "on" : ""}
      aria-current={route === path ? "page" : undefined}>
      <Icon name={icon} size={16} /> {label}
    </a>
  )

  return (
    <div className={darkMode ? "app dark" : "app"}>
      {notice && <div className="notice" role="status">{notice}</div>}

      <header className="topbar">
        <a className="brand" href="#/">
          <Logo />
          <span className="brand-name">CareerFlow</span>
        </a>

        <nav className="nav" aria-label="Main">
          {MAIN.map(link)}

          <div className="menu">
            <button
              type="button"
              className={"menu-btn" + (toolsActive ? " on" : "")}
              aria-haspopup="true"
              aria-expanded={toolsOpen}
              onClick={() => setToolsOpen((open) => !open)}
            >
              Tools <Icon name="chevron" size={14} />
            </button>
            {toolsOpen && <div className="menu-list">{TOOLS.map(link)}</div>}
          </div>

          {link(PROFILE)}
        </nav>

        <div className="topbar-actions">
          <button className="icon-btn" onClick={() => setDarkMode((v) => !v)}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
            <Icon name={darkMode ? "sun" : "moon"} />
          </button>

          <div className="user-chip" title={user.email}>
            <span className="user-av">{user.name.charAt(0).toUpperCase()}</span>
            <span className="user-name">{user.name.split(" ")[0]}</span>
          </div>

          <button className="icon-btn" onClick={() => onLogout()} aria-label="Log out" title="Log out">
            <LogoutIcon />
          </button>

          <button className="btn primary" onClick={pageProps.openNew}>
            <Icon name="plus" size={16} />
            <span>New application</span>
          </button>
        </div>
      </header>

      <main className="page">
        <Reminders applications={applications} userId={user.id} />
        <Page {...pageProps} />
      </main>

      <footer className="footer">
        <div className="brand">
          <Logo />
          <span className="brand-name">CareerFlow</span>
        </div>
        <p>Track every application from first click to signed offer.</p>
        <div className="footer-links">
          {NAV.slice(1).map(([path, label]) => (
            <a key={path} href={"#" + path}>{label}</a>
          ))}
        </div>
      </footer>

      <nav className="tabbar" aria-label="Mobile">
        {NAV.map(([path, label, icon]) => (
          <a key={path} href={"#" + path} className={route === path ? "on" : ""}>
            <Icon name={icon} size={20} />
            {label}
          </a>
        ))}
      </nav>

      {drawer && (
        <Drawer
          key={(drawer.application && drawer.application._id) || "new"}
          application={drawer.application}
          onClose={() => setDrawer(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

function App() {
  const [session, setSession] = useState(readSession)
  const [ready, setReady] = useState(false)
  const [message, setMessage] = useState("")
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true")

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode)
  }, [darkMode])

  const logout = async (text) => {
    await pushNow(false)
    localStorage.removeItem(SESSION_KEY)
    endSession()
    setReady(false)
    setSession(null)
    setMessage(typeof text === "string" ? text : "")
  }

  const handleAuth = (data) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(data))
    setReady(false)
    setMessage("")
    setSession(data)
  }

  useEffect(() => {
    if (!session) return

    let cancelled = false
    startSession(session.user.id, session.token)

    syncFromServer()
      .catch((error) => {
        if (error.status === 401 && !cancelled) {
          logout("Your session expired. Please log in again.")
        }
      })
      .finally(() => {
        if (!cancelled) setReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [session])

  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") pushNow(true)
    }
    document.addEventListener("visibilitychange", onHide)
    return () => document.removeEventListener("visibilitychange", onHide)
  }, [])

  const theme = darkMode ? "app dark" : "app"

  if (!session) {
    return (
      <div className={theme}>
        <Auth
          onAuth={handleAuth}
          notice={message}
          darkMode={darkMode}
          toggleDark={() => setDarkMode((v) => !v)}
        />
      </div>
    )
  }

  if (!ready) {
    return (
      <div className={theme}>
        <div className="boot">Loading your workspace...</div>
      </div>
    )
  }

  return (
    <Workspace
      key={session.user.id}
      session={session}
      onLogout={logout}
      darkMode={darkMode}
      setDarkMode={setDarkMode}
    />
  )
}

export default App