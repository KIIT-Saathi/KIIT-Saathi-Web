'use client'

import React from "react"

const LabIcon = () => <span>🔬</span>
const BreakIcon = () => <span>🍽️</span>

interface Period {
  time: string
  subject: string
  room: string
  faculty?: string
}

interface TodayData {
  day: string
  timetable: Period[]
  message?: string
}

interface TimetableData {
  section: string
  fullTimetable: Record<string, Period[]>
  today: TodayData
}

interface TimetableCardProps {
  data: TimetableData
  view: "today" | "week"
  onViewChange: (type: "today" | "week") => void
  onBack: () => void
}

const TimetableCard: React.FC<TimetableCardProps> = ({
  data,
  view,
  onViewChange,
  onBack,
}) => {
  const { section, fullTimetable, today } = data || {}
  const currentSchedule = view === "today" ? today?.timetable || [] : []
  const isTodayEmpty = today?.timetable?.length === 0

  const renderTable = (schedule: Period[]) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-4 px-4 font-semibold">Time</th>
            <th className="text-left py-4 px-4 font-semibold">Subject</th>
            <th className="text-left py-4 px-4 font-semibold">Room</th>
          </tr>
        </thead>

        <tbody>
          {schedule.map((period, index) => {
            const isBreak = period.subject.toLowerCase().includes("break")
            const isLab = period.subject.toLowerCase().includes("lab")

            return (
              <tr
                key={index}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  isBreak ? "bg-gray-50" : ""
                }`}
              >
                <td className="py-4 px-4 font-medium text-blue-600">
                  {period.time}
                </td>

                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {isLab && <LabIcon />}
                    {isBreak && <BreakIcon />}
                    <span
                      className={`font-medium ${
                        isBreak ? "text-gray-500 italic" : ""
                      }`}
                    >
                      {period.subject}
                    </span>
                  </div>
                </td>

                <td className="py-4 px-4 text-gray-600">
                  {period.room || "-"}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )

  if (view === "today" && isTodayEmpty) {
    return (
      <div className="glass-card rounded-3xl p-10 w-full max-w-4xl">
        <div className="text-center">
          <div className="text-6xl mb-6">🎉</div>

          <h2 className="text-4xl font-bold mb-2">
            {today?.message || "No Classes Today!"}
          </h2>

          <p className="text-lg text-gray-600 mb-6">
            Section: <span className="font-semibold">{section}</span>
          </p>

          <button 
            onClick={onBack} 
            className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            ← Back to Home
          </button>

          <button
            onClick={() => onViewChange("week")}
            className="block mx-auto mt-4 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Weekly 📅
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-3xl p-6 md:p-10 w-full max-w-6xl">
      <div className="mb-8 flex justify-between items-center">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
        >
          ← Back
        </button>

        <div className="text-center flex-1">
          <h2 className="text-4xl font-bold">
            {view === "today" ? `${today?.day}'s Schedule` : "Weekly Schedule"}
          </h2>
          <p className="text-lg text-gray-600">
            Section: <span className="font-semibold">{section}</span>
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onViewChange("today")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              view === "today"
                ? "bg-blue-600 text-white scale-105"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Today ⏰
          </button>

          <button
            onClick={() => onViewChange("week")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              view === "week"
                ? "bg-blue-600 text-white scale-105"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Weekly 📅
          </button>
        </div>
      </div>

      {view === "today" ? (
        renderTable(currentSchedule)
      ) : (
        <div className="space-y-6">
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => {
            const daySchedule = fullTimetable?.[day] || []
            return (
              <div key={day} className="bg-white p-4 rounded-xl border border-gray-200">
                <h3 className="font-bold text-xl mb-3">{day}</h3>
                {daySchedule.length > 0 ? (
                  renderTable(daySchedule)
                ) : (
                  <p className="text-gray-500">No classes</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default TimetableCard