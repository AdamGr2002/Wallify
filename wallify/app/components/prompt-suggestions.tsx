import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"

const suggestions = [
  "A vibrant cityscape at night with neon lights",
  "A serene beach scene with crystal clear water",
  "An enchanted forest with magical creatures",
  "A futuristic space station orbiting a distant planet",
  "A cozy cabin in a snowy mountain landscape",
]

interface PromptSuggestionsProps {
  setPrompt: (prompt: string) => void;
}

export default function PromptSuggestions({ setPrompt }: PromptSuggestionsProps) {
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([])

  useEffect(() => {
    // In a real app, you might fetch these from an API based on user preferences or trending topics
    const randomSuggestions = [...suggestions]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
    setCurrentSuggestions(randomSuggestions)
  }, [])

  return (
    <div className="flex flex-wrap gap-2">
      {currentSuggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => setPrompt(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  )
}