import { API_BASE } from "./config.js"

export async function api(path, options) {
  const o = options || {}
  const headers = { "Content-Type": "application/json" }

  if (o.token) {
    headers.Authorization = "Bearer " + o.token
  }

  let response

  try {
    response = await fetch(API_BASE + path, {
      method: o.method || "GET",
      headers,
      body: o.body ? JSON.stringify(o.body) : undefined
    })
  } catch (error) {
    throw new Error("Cannot reach the server. Is the backend running?")
  }

  let data = null

  try {
    data = await response.json()
  } catch (error) {
    data = null
  }

  if (!response.ok) {
    const failure = new Error((data && data.message) || "Something went wrong.")
    failure.status = response.status
    throw failure
  }

  return data
}