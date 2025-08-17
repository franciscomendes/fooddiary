"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Calendar, Clock, Smile, Frown, Meh } from "lucide-react"
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

export default function DiaryPage() {
  const [entries, setEntries] = useState<FoodEntry[]>([])

  useEffect(() => {
    // Load entries from localStorage
    const savedEntries = JSON.parse(localStorage.getItem("foodEntries") || "[]")
    setEntries(savedEntries)
  }, [])

  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id)
    setEntries(updatedEntries)
    localStorage.setItem("foodEntries", JSON.stringify(updatedEntries))
  }

  const clearAllEntries = () => {
    if (confirm("¿Estás seguro de que quieres eliminar todas las entradas?")) {
      setEntries([])
      localStorage.removeItem("foodEntries")
    }
  }

  if (entries.length === 0) {
    return (
      <AppLayout>
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Diario de Comidas</h1>
            <p className="text-gray-300 text-lg">Aquí verás todas tus entradas registradas</p>
          </div>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-12">
              <div className="text-center">
                <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No hay entradas aún</h3>
                <p className="text-gray-400 mb-6">
                  Comienza registrando tu primera comida en la página de inicio
                </p>
                <Button 
                  onClick={() => window.location.href = "/"}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Ir al Inicio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Diario de Comidas</h1>
            <p className="text-gray-300 text-lg">
              {entries.length} entrada{entries.length !== 1 ? 's' : ''} registrada{entries.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={clearAllEntries}
            className="bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Limpiar Todo
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {entries.map((entry) => (
          <Card key={entry.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg mb-2">{entry.food}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {entry.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {entry.time}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-700 text-sm">
                    {moodIcons[entry.mood]}
                    <span className="text-gray-200">{moodLabels[entry.mood]}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteEntry(entry.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {entry.feeling && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Sensación:</h4>
                    <p className="text-gray-200">{entry.feeling}</p>
                  </div>
                )}
                
                {entry.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Notas:</h4>
                    <p className="text-gray-200">{entry.notes}</p>
                  </div>
                )}
                
                {entry.image && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Foto:</h4>
                    <img
                      src={entry.image}
                      alt="Comida"
                      className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-600"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  )
}
