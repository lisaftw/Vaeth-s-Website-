"use server"

const ADMIN_PASSWORD = "unified2024"

export async function verifyPassword(formData: FormData) {
  const password = formData.get("password") as string

  if (!password) {
    return {
      success: false,
      error: "Password is required",
    }
  }

  if (password === ADMIN_PASSWORD) {
    return {
      success: true,
      message: "Authentication successful",
    }
  }

  return {
    success: false,
    error: "Invalid password",
  }
}
