/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const data = await req.json()

  // Verify the webhook signature (implement this function based on Paddle's documentation)
  if (!verifyWebhookSignature(data)) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
  }

  if (data.alert_name === 'payment_succeeded') {
    const userEmail = data.email
    const creditsToAdd = 1 // Adjust based on your credit system

    try {
      const user = await prisma.user.findFirst({
        where: { email: userEmail },
      })

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            credits: {
              increment: creditsToAdd,
            },
          },
        })
      }

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error('Error processing Paddle webhook:', error)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}

function verifyWebhookSignature(data: any) {
  // Implement webhook signature verification based on Paddle's documentation
  // This is crucial for security to ensure the webhook is genuinely from Paddle
  return true // Replace with actual verification logic
}