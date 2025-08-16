"use server"

import { redirect } from "next/navigation"
import { approveApplicationToServer } from "@/lib/data-store"

export async function approveApplication(formData: FormData) {
  const index = Number.parseInt(formData.get("index") as string)
  const password = formData.get("password") as string

  if (password !== "unified2024") {
    redirect("/admin?error=invalid")
    return
  }

  try {
    const success = approveApplicationToServer(index)

    if (success) {
      redirect(`/admin?password=${password}&tab=applications&approved=true`)
    } else {
      redirect(`/admin?password=${password}&tab=applications&error=approve_failed`)
    }
  } catch (error) {
    console.error("Error approving application:", error)
    redirect(`/admin?password=${password}&tab=applications&error=approve_failed`)
  }
}
