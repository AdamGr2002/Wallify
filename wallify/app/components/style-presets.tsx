import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const styles = [
  { value: 'realistic', label: 'Realistic' },
  { value: 'anime', label: 'Anime' },
  { value: 'abstract', label: 'Abstract' },
  { value: 'watercolor', label: 'Watercolor' },
  { value: 'digital-art', label: 'Digital Art' },
]

interface StylePresetsProps {
  selectedStyle: string;
  setSelectedStyle: (style: string) => void;
}

export default function StylePresets({ selectedStyle, setSelectedStyle }: StylePresetsProps) {
  return (
    <div className="space-y-2">
      <Label>Style Preset</Label>
      <RadioGroup value={selectedStyle} onValueChange={setSelectedStyle}>
        <div className="grid grid-cols-2 gap-2">
          {styles.map((style) => (
            <div key={style.value} className="flex items-center space-x-2">
              <RadioGroupItem value={style.value} id={style.value} />
              <Label htmlFor={style.value}>{style.label}</Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}