/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, Download } from 'lucide-react'
import StylePresets from './style-presets'
import ImageHistory from './image-history'
import PromptSuggestions from './prompt-suggestions'
import ResolutionOptimizer from './resolution-optimizer'
import UserAuth from './user-auth'

export default function WallpaperGenerator() {
  const { isSignedIn, user } = useUser()
  const [prompt, setPrompt] = useState('')
  const [deviceType, setDeviceType] = useState('phone')
  const [generatedImage, setGeneratedImage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [imageHistory, setImageHistory] = useState([])
  const [selectedStyle, setSelectedStyle] = useState('')
  const [resolution, setResolution] = useState({ width: 1080, height: 1920 })
  const [credits, setCredits] = useState(0)

  useEffect(() => {
    const newResolution = ResolutionOptimizer()
    setResolution(newResolution)
    if (isSignedIn) {
      fetchUserCredits()
    }
  }, [isSignedIn])

  const fetchUserCredits = async () => {
    const response = await fetch('/api/user-credits')
    const data = await response.json()
    setCredits(data.credits)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSignedIn) {
      alert('Please sign in to generate wallpapers')
      return
    }
    if (credits < 1) {
      alert('You need to purchase more credits to generate wallpapers')
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate-wallpaper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, deviceType, style: selectedStyle, resolution }),
      })
      const data = await response.json()
      setGeneratedImage(data.imageUrl)
      setImageHistory(prevHistory => [...prevHistory, { prompt, imageUrl: data.imageUrl, deviceType, style: selectedStyle }])
      setCredits(prevCredits => prevCredits - 1)
    } catch (error) {
      console.error('Error generating wallpaper:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <UserAuth />
      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        <div>
          <Label htmlFor="prompt">Describe your wallpaper</Label>
          <Input
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A serene mountain landscape at sunset"
            required
          />
        </div>
        <PromptSuggestions setPrompt={setPrompt} />
        <RadioGroup value={deviceType} onValueChange={setDeviceType}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="phone" id="phone" />
            <Label htmlFor="phone">Phone</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pc" id="pc" />
            <Label htmlFor="pc">PC</Label>
          </div>
        </RadioGroup>
        <StylePresets selectedStyle={selectedStyle} setSelectedStyle={setSelectedStyle} />
        <Button type="submit" disabled={isLoading || !isSignedIn || credits < 1} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            `Generate Wallpaper (${credits} credits left)`
          )}
        </Button>
      </form>
      {generatedImage && (
        <div className="mt-6">
          <img src={generatedImage} alt="Generated wallpaper" className="w-full rounded-lg shadow-md" />
          <Button asChild className="mt-4 w-full">
            <a href={generatedImage} download="ai-generated-wallpaper.png">
              <Download className="mr-2 h-4 w-4" />
              Download Wallpaper
            </a>
          </Button>
        </div>
      )}
      <ImageHistory history={imageHistory} />
    </div>
  )
}