/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { prompt, deviceType, style, resolution } = await req.json()

  // Use the optimized resolution from the client
  const { width, height } = resolution

  // Adjust the prompt based on the selected style
  let adjustedPrompt = prompt
  if (style) {
    adjustedPrompt = `${style} style: ${prompt}`
  }

  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
        input: { prompt: adjustedPrompt, width, height },
      }),
    })

    if (response.status !== 201) {
      const error = await response.json()
      return NextResponse.json({ error: error.detail }, { status: 500 })
    }

    const prediction = await response.json()
    const imageUrl = prediction.output[0]

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error('Error generating wallpaper:', error)
    return NextResponse.json({ error: 'Failed to generate wallpaper' }, { status: 500 })
  }
}