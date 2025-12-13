'use client'

import { useState } from "react"

interface InputCardProps {
  onSubmit: (rollNumber: string, view: "today" | "week") => void
}

const InputCard: React.FC<InputCardProps> = ({ onSubmit }) => {
  const [rollNumber, setRollNumber] = useState("")
  const [error, setError] = useState("")
  const [view, setView] = useState<"today" | "week">("today")
  const [year, setYear] = useState("")
  const [section, setSection] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const rollTrim = rollNumber.trim()
    const yearTrim = year.trim()
    const sectionTrim = section.trim()

    if (rollTrim) {
      if (!/^\d{6,10}$/.test(rollTrim)) {
        setError("Please enter a valid 6-10 digit roll number")
        return
      }
      setError("")
      onSubmit(rollTrim, view)
      return
    }

    if (yearTrim && sectionTrim) {
      setError("")
      onSubmit(`${yearTrim}|${sectionTrim.toUpperCase()}`, view)
      return
    }

    setError("Please enter either roll number OR both year and section")
  }

  return (
    <div className="glass-card rounded-3xl mt-5 p-8 md:p-12 w-full max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-gradient font-poppins text-4xl md:text-5xl font-bold mb-4">
          Time Table Saathi
        </h1>
        <p className="text-muted-foreground text-lg">
          Your Smart Timetable Companion
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => setView("today")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            view === "today"
              ? "bg-blue-600 text-white scale-105"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Today
        </button>

        <button
          type="button"
          onClick={() => setView("week")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            view === "week"
              ? "bg-blue-600 text-white scale-105"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Weekly
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="rollNumber"
            className="block text-sm font-medium mb-2"
          >
            Enter Your Roll Number
          </label>

          <input
            id="rollNumber"
            type="text"
            value={rollNumber}
            onChange={(e) => {
              setRollNumber(e.target.value)
              if (e.target.value.trim()) {
                setYear("")
                setSection("")
              }
            }}
            placeholder="e.g., 2305070 or 22051001"
            maxLength={10}
            className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-gray-500">OR</span>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="year" className="block text-sm font-medium mb-2">
                Year
              </label>

              <select
                id="year"
                value={year}
                onChange={(e) => {
                  setYear(e.target.value)
                  if (e.target.value) {
                    setRollNumber("")
                  }
                }}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select year</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
              </select>
            </div>
            <div>
              <label htmlFor="section" className="block text-sm font-medium mb-2">
                Section
              </label>
              <input
                id="section"
                type="text"
                value={section}
                onChange={(e) => {
                  setSection(e.target.value)
                  if (e.target.value.trim()) {
                    setRollNumber("")
                  }
                }}
                placeholder="e.g., CSE-A, IT-1, M-1"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="text-red-600 text-sm mt-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full py-4 rounded-xl font-semibold text-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Get Timetable 📚
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          Try roll numbers like: 2305070, 23051001<br />
          Or select year + section: 2nd Year, CSE-A / M-1
        </p>
      </div>
    </div>
  )
}

export default InputCard