import { CalendarDays, Clock, Frown, Meh, Smile } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

const moodIcons = {
    happy: <Smile className="w-4 h-4" />,
    neutral: <Meh className="w-4 h-4" />,
    sad: <Frown className="w-4 h-4" />,
  }

export interface FoodEntry {
    id: string
    food: string
    time: string
    date: string
    feeling: string
    notes: string
    mood: "happy" | "neutral" | "sad"
    image?: string
  }

export default function DiaryEntry({ entry }: { entry: FoodEntry }) {
    return (
        <Card
                  key={entry.id}
                  className="bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-gray-900/50 transition-shadow"
                >
                  <CardContent className="p-0">
                    {entry.image && (
                      <div className="relative">
                        <img
                          src={entry.image || "/placeholder.svg"}
                          alt={entry.food}
                          className="w-full h-56 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-3 right-3 bg-gray-900/90 backdrop-blur-sm rounded-full p-2">
                          {moodIcons[entry.mood as keyof typeof moodIcons]}
                        </div>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white mb-2 leading-tight">{entry.food}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-400">
                            <div className="flex items-center gap-1.5">
                              <CalendarDays className="w-4 h-4" />
                              <span>{entry.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              <span>{entry.time}</span>
                            </div>
                          </div>
                        </div>
                        {!entry.image && (
                          <div className="flex items-center gap-1 bg-gray-700 rounded-full p-2">
                            {moodIcons[entry.mood as keyof typeof moodIcons]}
                          </div>
                        )}
                      </div>

                      {entry.feeling && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                            <span className="text-sm font-medium text-gray-400">Cómo te sentiste</span>
                          </div>
                          <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 font-medium">
                            {entry.feeling}
                          </Badge>
                        </div>
                      )}

                      {entry.notes && (
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                            <span className="text-sm font-medium text-gray-400">Notas</span>
                          </div>
                          <p className="text-gray-200 text-sm leading-relaxed bg-gray-700/50 rounded-lg p-3">
                            {entry.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
    )
}