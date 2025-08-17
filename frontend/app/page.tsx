"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ActivityIcon, Smile, Frown, Meh, Camera, Upload, X } from "lucide-react"
import CameraComponent from "@/components/custom/CameraComponent"
import { FoodEntry } from "@/components/custom/DiaryEntry"
import AppLayout from "@/components/custom/AppLayout"

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

export default function HomePage() {
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

    // Store in localStorage for now (in a real app, this would go to a database)
    const existingEntries = JSON.parse(localStorage.getItem("foodEntries") || "[]")
    const updatedEntries = [newEntry, ...existingEntries]
    localStorage.setItem("foodEntries", JSON.stringify(updatedEntries))

    // Reset form
    setFood("")
    setFeeling("")
    setNotes("")
    setMood("neutral")
    setSelectedImage(null)

    // Show success message
    alert("¡Entrada guardada exitosamente!")
  }

  return (
    <AppLayout>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Registra tu Comida</h1>
        <p className="text-gray-300 text-lg">Anota lo que comiste y cómo te hizo sentir</p>
      </div>

      <Card className="mb-8 bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <ActivityIcon className="w-5 h-5 text-orange-400" />
            Nueva Entrada
          </CardTitle>
          <CardDescription className="text-gray-300">Completa el formulario para registrar tu comida</CardDescription>
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

      {showCamera && (
        <CameraComponent
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </AppLayout>
  )
}
