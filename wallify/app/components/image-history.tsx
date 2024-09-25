import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"

export default function ImageHistory({ history }) {
  if (history.length === 0) return null

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Image History</h2>
      <ScrollArea className="h-[300px]">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {history.map((item, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-2">
                <img src={item.imageUrl} alt={item.prompt} className="w-full h-40 object-cover rounded" />
                <p className="mt-2 text-sm truncate">{item.prompt}</p>
                <div className="mt-1 text-xs text-gray-500">
                  <span className="capitalize">{item.deviceType}</span> | {item.style}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}