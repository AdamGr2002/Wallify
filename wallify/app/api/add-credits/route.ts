import { NextResponse, NextRequest } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req)

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { amount } = await req.json()

  try {
    const user = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        credits: {
          increment: amount,
        },
      },
    })

    return NextResponse.json({ credits: user.credits })
  } catch (error) {
    console.error('Error adding credits:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}