import { useState } from "react"
import Logo from "../Logo.jsx"
import { Icon } from "../components.jsx"
import { api } from "../api.js"

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)

export default function Auth({ onAuth, notice, darkMode, toggleDark }) {
  const [mode, setMode] = useState("login")
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "" })
  const [show, setShow] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState(notice || "")
  const [busy, setBusy] = useState(false)

  const isRegister = mode === "register"

  const bind = (k) => ({
    id: k,
    value: f[k],
    onChange: (e) => {
      setF({ ...f, [k]: e.target.value })
      if (errors[k]) setErrors({ ...errors, [k]: "" })
    }
  })

  const switchMode = (next) => {
    setMode(next)
    setErrors({})
    setServerError("")
  }

  const validate = () => {
    const e = {}

    if (isRegister && f.name.trim().length < 2) {
      e.name = "Enter your name."
    }

    if (!emailOk(f.email.trim())) {
      e.email = "Enter a valid email address."
    }

    if (isRegister) {
      if (f.password.length < 8 || !/[A-Za-z]/.test(f.password) || !/\d/.test(f.password)) {
        e.password = "Use 8 or more characters with a letter and a number."
      }
      if (f.confirm !== f.password) {
        e.confirm = "The passwords don't match."
      }
    } else if (!f.password) {
      e.password = "Enter your password."
    }

    return e
  }

  const submit = async (event) => {
    event.preventDefault()
    setServerError("")

    const found = validate()
    setErrors(found)
    if (Object.values(found).some(Boolean)) return

    setBusy(true)

    try {
      const body = isRegister
        ? { name: f.name.trim(), email: f.email.trim(), password: f.password }
        : { email: f.email.trim(), password: f.password }

      const data = await api(isRegister ? "/auth/register" : "/auth/login", {
        method: "POST",
        body
      })

      onAuth(data)
    } catch (error) {
      setServerError(error.message)
      setBusy(false)
    }
  }

  const fieldClass = (k) => (errors[k] ? "field bad" : "field")
  const showError = (k) =>
    errors[k] ? <small className="err" role="alert">{errors[k]}</small> : null

  return (
    <div className="auth">
      <aside className="auth-side">
        <div className="auth-brand">
          <Logo size={44} />
          <span>CareerFlow</span>
        </div>

        <div>
          <h1>Every application, from first click to signed offer.</h1>
          <ul>
            <li>Track every role in one private workspace</li>
            <li>Get reminded before each interview</li>
            <li>Build an ATS-friendly resume and prepare to win</li>
          </ul>
        </div>

        <small>Your applications and resume are private to your account.</small>
      </aside>

      <main className="auth-main">
        <button className="icon-btn auth-theme" onClick={toggleDark}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
          <Icon name={darkMode ? "sun" : "moon"} />
        </button>

        <div className="auth-card">
          <div className="auth-tabs" role="tablist">
            <button role="tab" aria-selected={!isRegister}
              className={!isRegister ? "on" : ""} onClick={() => switchMode("login")}>
              Log in
            </button>
            <button role="tab" aria-selected={isRegister}
              className={isRegister ? "on" : ""} onClick={() => switchMode("register")}>
              Create account
            </button>
          </div>

          <h2>{isRegister ? "Create your account" : "Welcome back"}</h2>
          <p className="auth-sub">
            {isRegister
              ? "It takes less than a minute."
              : "Log in to see your applications."}
          </p>

          {serverError && <div className="auth-err" role="alert">{serverError}</div>}

          <form onSubmit={submit} noValidate>
            {isRegister && (
              <div className={fieldClass("name")}>
                <label htmlFor="name">Full name</label>
                <input type="text" autoComplete="name" placeholder="e.g. Priya Kumar" {...bind("name")} />
                {showError("name")}
              </div>
            )}

            <div className={fieldClass("email")}>
              <label htmlFor="email">Email</label>
              <input type="email" autoComplete="email" placeholder="you@email.com" {...bind("email")} />
              {showError("email")}
            </div>

            <div className={fieldClass("password")}>
              <label htmlFor="password">Password</label>
              <input type={show ? "text" : "password"}
                autoComplete={isRegister ? "new-password" : "current-password"}
                placeholder={isRegister ? "8+ characters, letters and numbers" : "Your password"}
                {...bind("password")} />
              {showError("password")}
            </div>

            {isRegister && (
              <div className={fieldClass("confirm")}>
                <label htmlFor="confirm">Confirm password</label>
                <input type={show ? "text" : "password"} autoComplete="new-password"
                  placeholder="Type it again" {...bind("confirm")} />
                {showError("confirm")}
              </div>
            )}

            <label className="auth-show">
              <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />
              Show password
            </label>

            <button className="btn primary big auth-submit" type="submit" disabled={busy}>
              {busy ? "Please wait..." : isRegister ? "Create account" : "Log in"}
            </button>
          </form>

          <p className="auth-switch">
            {isRegister ? "Already have an account? " : "New to CareerFlow? "}
            <button type="button" onClick={() => switchMode(isRegister ? "login" : "register")}>
              {isRegister ? "Log in" : "Create an account"}
            </button>
          </p>
        </div>
      </main>
    </div>
  )
}