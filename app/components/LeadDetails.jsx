

"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"


function timeAgo(dateString) {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now - date
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  if (diffMinutes < 1) return `Just now`
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} hours ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return `Yesterday`
  return `${diffDays} days ago`
}


const activityTypeConfig = {
  "Deal closed": { color: "green", icon: "●" },
  "Proposal sent": { color: "blue", icon: "●" },
  "Qualified": { color: "orange", icon: "●" },
  "Invoice uploaded": { color: "blue", icon: "📎" },
  "Follow-up overdue": { color: "gray", icon: "●" },
  "Call": { color: "teal", icon: "📞" },
  "Email": { color: "purple", icon: "✉️" },
}

export default function LeadDetails() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchActivities() {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get("http://localhost:8080/get", {
          headers: { "auth-token": token },
        })
        if (res.data.success) {
          setActivities(res.data.data)
        } else {
          setError("Failed to fetch activities")
        }
      } catch (err) {
        setError("Error fetching activities")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  if (loading) return <div>Loading recent activities...</div>
  if (error) return <div style={{ color: "red" }}>{error}</div>

  return (
    <div style={{ maxWidth: 600, margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h3 style={{ fontWeight: "bold", marginBottom: 20 }}>Recent Activity</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {activities.map((act) => {
          const { color, icon } = activityTypeConfig[act.type] || {
            color: "black",
            icon: "●",
          }
          const timeLabel = timeAgo(act.createdAt)

         
          let extraInfo = ""
          if (act.type === "Deal closed" && act.metadata?.amount) {
            extraInfo = `· ₹${act.metadata.amount}`
          }
          if (act.type === "Qualified" && act.metadata?.bantScore) {
            extraInfo = `· BANT ${act.metadata.bantScore}`
          }
          if (act.type === "Invoice uploaded" && act.metadata?.invoiceId) {
            extraInfo = act.metadata.invoiceId
          }
          if (act.type === "Follow-up overdue" && act.metadata?.day) {
            extraInfo = `(Day ${act.metadata.day})`
          }

          
          const location = act.metadata?.city || "Unknown"

          return (
            <li
              key={act._id}
              style={{
                marginBottom: 16,
                borderBottom: "1px solid #eee",
                paddingBottom: 12,
              }}
            >
              <span
                style={{
                  color,
                  marginRight: 8,
                  fontWeight: "bold",
                  fontSize: 18,
                  verticalAlign: "middle",
                }}
              >
                {icon}
              </span>
              <span style={{ fontWeight: "bold" }}>{act.type}</span> —{" "}
              <span style={{ fontWeight: "bold" }}>
                {act.lead?.businessName || "No Lead"}
              </span>{" "}
              {extraInfo && <span>{extraInfo}</span>}{" "}
              <span
                style={{
                  backgroundColor: "#def7ec",
                  color: "#03543f",
                  borderRadius: 12,
                  padding: "2px 8px",
                  fontSize: 12,
                  marginLeft: 8,
                  verticalAlign: "middle",
                }}
              >
                {act.user?.name}
              </span>
              <div
                style={{
                  fontSize: 12,
                  color: "#6b7280",
                  marginTop: 6,
                  userSelect: "none",
                }}
              >
                {timeLabel} · {location}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}