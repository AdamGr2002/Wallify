/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Script from 'next/script'

declare global {
  interface Window {
    Paddle: any;
  }
}

export default function UserAuth() {
  const { isSignedIn, user } = useUser()
  const [credits, setCredits] = useState(0)

  useEffect(() => {
    if (isSignedIn) {
      fetchUserCredits()
    }
  }, [isSignedIn])

  const fetchUserCredits = async () => {
    const response = await fetch('/api/user-credits')
    const data = await response.json()
    setCredits(data.credits)
  }

  const handleBuyCredits = () => {
    if (window.Paddle) {
      window.Paddle.Checkout.open({
        product: process.env.NEXT_PUBLIC_PADDLE_PRODUCT_ID,
        email: user.primaryEmailAddress.emailAddress,
        successCallback: (data: any) => {
          handleSuccessfulPurchase(data)
        },
      })
    }
  }

  const handleSuccessfulPurchase = async (data: any) => {
    const response = await fetch('/api/add-credits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: 1 }), // Assuming 1 credit per purchase
    })
    const result = await response.json()
    setCredits(result.credits)
  }

  if (!isSignedIn) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Sign in to generate wallpapers and manage your credits</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.href = '/sign-in'}>Sign In</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Script
        src="https://cdn.paddle.com/paddle/paddle.js"
        onLoad={() => {
          window.Paddle.Setup({ vendor: process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID })
        }}
      />
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user.firstName}!</CardTitle>
          <CardDescription>You have {credits} credits remaining</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleBuyCredits}>Buy More Credits</Button>
        </CardContent>
      </Card>
    </>
  )
}