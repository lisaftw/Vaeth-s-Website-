"use server"

import { redirect } from "next/navigation"

interface Announcement {
  id: string
  title: string
  content: string
  type: "info" | "warning" | "success" | "error"
  active: boolean
  createdAt: string
  updatedAt: string
}

// Mock data store - in a real app, this would be a database
let announcements: Announcement[] = [
  {
    id: "1",
    title: "Welcome to Unified Realms",
    content: "Join our growing alliance of Discord servers!",
    type: "info",
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function manageAnnouncements(formData: FormData) {
  const password = formData.get("password") as string
  const action = formData.get("action") as string

  if (password !== "unified2024") {
    redirect("/admin?error=invalid")
    return
  }

  try {
    const data = {
      content: formData.get("content") as string,
      action: action,
    }

    console.log("Managing announcement:", data)

    switch (action) {
      case "create":
        const newAnnouncement: Announcement = {
          id: Date.now().toString(),
          title: formData.get("title") as string,
          content: formData.get("content") as string,
          type: (formData.get("type") as "info" | "warning" | "success" | "error") || "info",
          active: formData.get("active") === "true",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        announcements.push(newAnnouncement)
        break

      case "update":
        const updateId = formData.get("id") as string
        const announcementIndex = announcements.findIndex((a) => a.id === updateId)
        if (announcementIndex !== -1) {
          announcements[announcementIndex] = {
            ...announcements[announcementIndex],
            title: formData.get("title") as string,
            content: formData.get("content") as string,
            type: (formData.get("type") as "info" | "warning" | "success" | "error") || "info",
            active: formData.get("active") === "true",
            updatedAt: new Date().toISOString(),
          }
        }
        break

      case "delete":
        const deleteId = formData.get("id") as string
        announcements = announcements.filter((a) => a.id !== deleteId)
        break

      case "toggle":
        const toggleId = formData.get("id") as string
        const toggleIndex = announcements.findIndex((a) => a.id === toggleId)
        if (toggleIndex !== -1) {
          announcements[toggleIndex].active = !announcements[toggleIndex].active
          announcements[toggleIndex].updatedAt = new Date().toISOString()
        }
        break
    }

    redirect(`/admin?password=${password}&tab=announcements&success=${action}`)
  } catch (error) {
    console.error("Error managing announcements:", error)
    redirect(`/admin?password=${password}&tab=announcements&error=${action}_failed`)
  }
}

export async function getAnnouncements() {
  return announcements
}
