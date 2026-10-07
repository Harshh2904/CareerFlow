import { API_BASE } from "./config.js"
import { api } from "./api.js"

export const DATA_KEYS = [
  "cf-profile",
  "cf-prep",
  "cf-missions",
  "cf-mission-days",
  "cf-skills",
  "cf-goals"
]

let userId = "guest"
let token = ""
let timer = null

export function startSession(id, newToken) {
  userId = id
  token = newToken
}

export function endSession() {
  clearTimeout(timer)
  userId = "guest"
  token = ""
}

export const scoped = (key) => "cf:" + userId + ":" + key

function readAll() {
  const out = {}

  DATA_KEYS.forEach((key) => {
    const raw = localStorage.getItem(scoped(key))
    if (raw) {
      try {
        out[key] = JSON.parse(raw)
      } catch (error) {
        /* ignore broken value */
      }
    }
  })

  return out
}

function writeAll(data) {
  DATA_KEYS.forEach((key) => {
    if (data && data[key] !== undefined) {
      localStorage.setItem(scoped(key), JSON.stringify(data[key]))
    }
  })
}

export async function pushNow(keep) {
  clearTimeout(timer)

  if (!token) return

  try {
    await fetch(API_BASE + "/auth/data", {
      method: "PUT",
      keepalive: Boolean(keep),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ data: readAll() })
    })
  } catch (error) {
    /* offline: the next change will try again */
  }
}

export function schedulePush() {
  if (!token) return
  clearTimeout(timer)
  timer = setTimeout(() => pushNow(false), 800)
}

export async function syncFromServer() {
  const res = await api("/auth/data", { token })
  const merged = { ...(res.data || {}) }
  let imported = false

  DATA_KEYS.forEach((key) => {
    if (merged[key] === undefined) {
      const old = localStorage.getItem(key)

      if (old) {
        try {
          merged[key] = JSON.parse(old)
          imported = true
        } catch (error) {
          /* ignore */
        }

        localStorage.removeItem(key)
      }
    }
  })

  writeAll(merged)

  if (imported) schedulePush()
}