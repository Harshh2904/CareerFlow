const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const app = express()

const JWT_SECRET =
  process.env.JWT_SECRET || "careerflow-dev-secret-change-before-going-online"

const DATA_KEYS = [
  "cf-profile",
  "cf-prep",
  "cf-missions",
  "cf-mission-days",
  "cf-skills",
  "cf-goals"
]

const STATUSES = ["Applied", "Interview", "Offer", "Rejected"]

app.use(cors())
app.use(express.json({ limit: "1mb" }))

/* ---------- Models ---------- */

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true, minimize: false }
)

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  company: String,
  role: String,
  date: String,
  status: String,
  location: String,
  jobLink: String,
  notes: String,
  interviewDate: String
})

const User = mongoose.model("User", userSchema)
const Application = mongoose.model("Application", applicationSchema)

/* ---------- Helpers ---------- */

const today = () => new Date().toLocaleDateString("en-CA")
const isDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v || "")
const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v || "")
const passwordOk = (v) =>
  typeof v === "string" &&
  v.length >= 8 &&
  v.length <= 72 &&
  /[A-Za-z]/.test(v) &&
  /\d/.test(v)

const makeToken = (user) =>
  jwt.sign({ id: user._id.toString() }, JWT_SECRET, { expiresIn: "7d" })

const publicUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email
})

const attempts = new Map()

const tooManyTries = (key) => {
  const now = Date.now()
  const recent = (attempts.get(key) || []).filter((t) => now - t < 15 * 60 * 1000)
  attempts.set(key, recent)
  return recent.length >= 10
}

const noteFailure = (key) => {
  const list = attempts.get(key) || []
  list.push(Date.now())
  attempts.set(key, list)
}

function cleanApplication(body) {
  const b = body || {}
  const str = (v) => (typeof v === "string" ? v.trim() : "")

  const data = {
    company: str(b.company),
    role: str(b.role),
    date: str(b.date),
    status: str(b.status) || "Applied",
    location: str(b.location),
    jobLink: str(b.jobLink),
    notes: str(b.notes),
    interviewDate: str(b.interviewDate)
  }

  let error = ""

  if (!data.company || !data.role) {
    error = "Company and role are required."
  } else if (!isDate(data.date)) {
    error = "A valid application date is required."
  } else if (data.date > today()) {
    error = "The application date can't be in the future."
  } else if (!STATUSES.includes(data.status)) {
    error = "Invalid status."
  } else if (
    data.interviewDate &&
    (!isDate(data.interviewDate) || data.interviewDate < data.date)
  ) {
    error = "The interview date can't be before the application date."
  }

  return { data, error }
}

function auth(req, res, next) {
  const header = req.headers.authorization || ""
  const token = header.startsWith("Bearer ") ? header.slice(7) : ""

  if (!token) {
    return res.status(401).json({ message: "Please log in." })
  }

  try {
    req.userId = jwt.verify(token, JWT_SECRET).id
    next()
  } catch (error) {
    res.status(401).json({ message: "Session expired. Please log in again." })
  }
}

/* ---------- Routes ---------- */

app.get("/", (req, res) => {
  res.send("CareerFlow Backend is Running!")
})

app.post("/auth/register", async (req, res) => {
  try {
    const body = req.body || {}
    const name = typeof body.name === "string" ? body.name.trim() : ""
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
    const password = body.password

    if (name.length < 2 || name.length > 60) {
      return res.status(400).json({ message: "Enter your name (2 to 60 characters)." })
    }
    if (!emailOk(email)) {
      return res.status(400).json({ message: "Enter a valid email address." })
    }
    if (!passwordOk(password)) {
      return res.status(400).json({
        message: "Password must be 8 to 72 characters with at least one letter and one number."
      })
    }
    if (await User.findOne({ email })) {
      return res.status(409).json({ message: "An account with this email already exists." })
    }

    const isFirstUser = (await User.countDocuments()) === 0
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, passwordHash })

    if (isFirstUser) {
      await Application.updateMany({ user: { $exists: false } }, { user: user._id })
    }

    res.status(201).json({ token: makeToken(user), user: publicUser(user) })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Could not create the account." })
  }
})

app.post("/auth/login", async (req, res) => {
  try {
    const body = req.body || {}
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
    const password = typeof body.password === "string" ? body.password : ""
    const key = req.ip + "|" + email

    if (tooManyTries(key)) {
      return res.status(429).json({ message: "Too many attempts. Try again in 15 minutes." })
    }

    const user = email ? await User.findOne({ email }) : null
    const ok = user ? await bcrypt.compare(password, user.passwordHash) : false

    if (!ok) {
      noteFailure(key)
      return res.status(401).json({ message: "Incorrect email or password." })
    }

    res.json({ token: makeToken(user), user: publicUser(user) })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Could not log in." })
  }
})

app.get("/auth/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) return res.status(401).json({ message: "Please log in again." })
    res.json({ user: publicUser(user) })
  } catch (error) {
    res.status(500).json({ message: "Could not load your account." })
  }
})

app.get("/auth/data", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) return res.status(401).json({ message: "Please log in again." })
    res.json({ data: user.data || {} })
  } catch (error) {
    res.status(500).json({ message: "Could not load your saved data." })
  }
})

app.put("/auth/data", auth, async (req, res) => {
  try {
    const incoming = req.body && req.body.data
    if (!incoming || typeof incoming !== "object" || Array.isArray(incoming)) {
      return res.status(400).json({ message: "Invalid data." })
    }

    const clean = {}
    DATA_KEYS.forEach((key) => {
      if (incoming[key] !== undefined) clean[key] = incoming[key]
    })

    await User.findByIdAndUpdate(req.userId, { data: clean })
    res.json({ message: "Saved" })
  } catch (error) {
    res.status(500).json({ message: "Could not save your data." })
  }
})

app.get("/applications", auth, async (req, res) => {
  try {
    const applications = await Application.find({ user: req.userId }).sort({ _id: -1 })
    res.json(applications)
  } catch (error) {
    res.status(500).json({ message: "Could not fetch applications" })
  }
})

app.post("/applications", auth, async (req, res) => {
  try {
    const { data, error } = cleanApplication(req.body)
    if (error) return res.status(400).json({ message: error })

    const saved = await Application.create({ ...data, user: req.userId })
    res.status(201).json(saved)
  } catch (error) {
    res.status(500).json({ message: "Could not save application" })
  }
})

app.put("/applications/:id", auth, async (req, res) => {
  try {
    const { data, error } = cleanApplication(req.body)
    if (error) return res.status(400).json({ message: error })

    const updated = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      data,
      { new: true }
    )

    if (!updated) return res.status(404).json({ message: "Application not found" })
    res.json(updated)
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Application not found" })
    }
    res.status(500).json({ message: "Could not update application" })
  }
})

app.delete("/applications/:id", auth, async (req, res) => {
  try {
    const removed = await Application.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    })

    if (!removed) return res.status(404).json({ message: "Application not found" })
    res.json({ message: "Application deleted successfully" })
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Application not found" })
    }
    res.status(500).json({ message: "Could not delete application" })
  }
})

/* ---------- Start ---------- */

mongoose
  .connect("mongodb://127.0.0.1:27017/jobTracker")
  .then(() => {
    console.log("MongoDB connected successfully")
  })
  .catch((error) => {
    console.log("MongoDB connection failed")
    console.log(error)
  })

const PORT = 5000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})