"use server"

import { redirect } from "next/navigation"
import { removeServer as removeServerFromStore } from "@/lib/data-store"

export async function removeServer(formData: FormData) {
  const index = Number.parseInt(formData.get("index") as string)
  const password = formData.get("password") as string

  if (password !== "unified2024") {
    redirect("/admin?error=invalid")
    return
  }

  try {
    const removedServer = removeServerFromStore(index)

    if (removedServer) {
      redirect(`/admin?password=${password}&tab=servers&removed=true`)
    } else {
      redirect(`/admin?password=${password}&tab=servers&error=remove_failed`)
    }
  } catch (error) {
    console.error("Error removing server:", error)
    redirect(`/admin?password=${password}&tab=servers&error=remove_failed`)
  }
}
