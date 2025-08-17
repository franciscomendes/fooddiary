"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, ActivityIcon, Heart, Smile, Frown, Meh, Camera, Upload, X } from "lucide-react"
import CameraComponent from "@/components/custom/CameraComponent"

interface FoodEntry {
  id: string
  food: string
  time: string
  date: string
  feeling: string
  notes: string
  mood: "happy" | "neutral" | "sad"
  image?: string
}

const moodIcons = {
  happy: <Smile className="w-4 h-4 text-green-400" />,
  neutral: <Meh className="w-4 h-4 text-yellow-400" />,
  sad: <Frown className="w-4 h-4 text-red-400" />,
}

const moodLabels = {
  happy: "Bien",
  neutral: "Regular",
  sad: "Mal",
}

// Camera component for taking pictures

export default function FoodDiaryApp() {
  const [entries, setEntries] = useState<FoodEntry[]>([])
  const [food, setFood] = useState("")
  const [feeling, setFeeling] = useState("")
  const [notes, setNotes] = useState("")
  const [mood, setMood] = useState<"happy" | "neutral" | "sad">("neutral")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraCapture = (imageData: string) => {
    setSelectedImage(imageData)
  }

  const removeImage = () => {
    setSelectedImage(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!food.trim()) return

    const newEntry: FoodEntry = {
      id: Date.now().toString(),
      food: food.trim(),
      time: new Date().toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date().toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      feeling: feeling.trim(),
      notes: notes.trim(),
      mood,
      image: selectedImage || undefined,
    }

    setEntries((prev) => [newEntry, ...prev])

    setFood("")
    setFeeling("")
    setNotes("")
    setMood("neutral")
    setSelectedImage(null)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Diario de Comidas</h1>
          <p className="text-gray-300 text-lg">Registra tus comidas y cómo te hacen sentir</p>
        </div>

        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <ActivityIcon className="w-5 h-5 text-orange-400" />
              Registra tu Comida
            </CardTitle>
            <CardDescription className="text-gray-300">Anota lo que comiste y cómo te hizo sentir</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="food" className="text-gray-200">
                  ¿Qué comiste?
                </Label>
                <Input
                  id="food"
                  value={food}
                  onChange={(e) => setFood(e.target.value)}
                  placeholder="ej., Ensalada de pollo a la plancha con aguacate"
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-200">Foto de la comida (opcional)</Label>
                <div className="space-y-4">
                  {selectedImage ? (
                    <div className="relative">
                      <img
                        src={selectedImage || "/placeholder.svg"}
                        alt="Comida seleccionada"
                        className="w-full h-48 object-cover rounded-lg border border-gray-600"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removeImage}
                        className="absolute top-2 right-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Label
                        onClick={() => setShowCamera(true)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                      >
                        <Camera className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-300">Tomar Foto</span>
                      </Label>
                      <Label
                        htmlFor="upload-input"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                      >
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-300">Subir Foto</span>
                      </Label>
                    </div>
                  )}
                  <Input
                    id="upload-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-200">¿Cómo te sentó?</Label>
                <div className="flex gap-4">
                  {(["happy", "neutral", "sad"] as const).map((moodOption) => (
                    <button
                      key={moodOption}
                      type="button"
                      onClick={() => setMood(moodOption)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                        mood === moodOption
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-200"
                      }`}
                    >
                      {moodIcons[moodOption]}
                      <span>{moodLabels[moodOption]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-gray-200">
                  Notas adicionales (opcional)
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Cualquier otro pensamiento u observación..."
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 min-h-[80px]"
                />
              </div>

              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                Guardar Entrada
              </Button>
            </form>
          </CardContent>
        </Card>

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
                          {moodIcons[entry.mood]}
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
                            {moodIcons[entry.mood]}
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
              ))}
            </div>
          )}
        </div>
      </div>
      {showCamera && (
        <CameraComponent
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  )
}
