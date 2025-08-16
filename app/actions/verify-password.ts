"use server"

import { redirect } from "next/navigation"

export async function verifyPassword(formData: FormData) {
  const password = formData.get("password") as string

  if (password === "unified2024") {
    redirect("/admin?password=unified2024&tab=applications")
  } else {
    redirect("/admin?error=invalid")
  }
}
