import DiaryEntry, { FoodEntry } from "@/components/custom/DiaryEntry";
import { Card, CardContent } from "../ui/card";
import { Heart } from "lucide-react";
import { Badge } from "../ui/badge";

export default function Diary({ entries }: { entries: FoodEntry[] }) {
    return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Tu Diario de Comidas</h2>
            {entries.length > 0 && (
              <Badge variant="outline" className="text-sm border-gray-600 text-gray-300">
                {entries.length} {entries.length === 1 ? "entrada" : "entradas"}
              </Badge>
            )}
          </div>
          {entries.length === 0 ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="py-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                    <Heart className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-lg font-medium mb-1">Aún no hay entradas</p>
                    <p className="text-gray-400 text-sm">¡Comienza registrando tu primera comida arriba!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {entries.map((entry) => (
                  <DiaryEntry key={entry.id} entry={entry} />
                ))}
            </div>
            )}
        </div>
    )
}