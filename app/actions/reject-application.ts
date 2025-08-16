"use server"

import { redirect } from "next/navigation"
import { removeApplication } from "@/lib/data-store"

export async function rejectApplication(formData: FormData) {
  const index = Number.parseInt(formData.get("index") as string)
  const password = formData.get("password") as string

  if (password !== "unified2024") {
    redirect("/admin?error=invalid")
    return
  }

  try {
    const removedApplication = removeApplication(index)

    if (removedApplication) {
      redirect(`/admin?password=${password}&tab=applications&rejected=true`)
    } else {
      redirect(`/admin?password=${password}&tab=applications&error=reject_failed`)
    }
  } catch (error) {
    console.error("Error rejecting application:", error)
    redirect(`/admin?password=${password}&tab=applications&error=reject_failed`)
  }
}
