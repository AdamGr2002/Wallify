import WallpaperGenerator from './components/wallpaper-generator'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-800">AI Wallpaper Generator</h1>
        <WallpaperGenerator />
      </div>
    </div>
  )
}