'use server'

import { redirect } from 'next/navigation'
import { sendDiscordWebhook } from '@/lib/discord-webhook'

export async function submitApplication(formData: FormData) {
  try {
    const serverName = formData.get('serverName') as string
    const serverInvite = formData.get('serverInvite') as string
    const memberCount = formData.get('memberCount') as string
    const ownerName = formData.get('ownerName') as string
    const representativeDiscordId = formData.get('representativeDiscordId') as string
    const description = formData.get('description') as string

    // Validate required fields
    if (!serverName || !serverInvite || !memberCount || !ownerName || !representativeDiscordId || !description) {
      throw new Error('All fields are required')
    }

    // Send Discord webhook notification
    await sendDiscordWebhook({
      serverName,
      serverInvite,
      memberCount: parseInt(memberCount),
      ownerName,
      representativeDiscordId,
      description
    })

    console.log('Application submitted:', {
      serverName,
      serverInvite,
      memberCount,
      ownerName,
      representativeDiscordId,
      description
    })

  } catch (error) {
    console.error('Error submitting application:', error)
    throw error
  }

  redirect('/confirmation')
}
