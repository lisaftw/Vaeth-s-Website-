"use server"

const ADMIN_PASSWORD = "unified2024"

export async function verifyPassword(formData: FormData) {
  const password = formData.get("password") as string

  console.log("Password verification attempt")

  if (password === ADMIN_PASSWORD) {
    console.log("Password verification successful")
    return {
      success: true,
      message: "Authentication successful",
    }
  } else {
    console.log("Password verification failed")
    return {
      success: false,
      error: "Invalid password",
    }
  }
}
