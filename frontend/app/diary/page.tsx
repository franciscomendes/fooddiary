"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Calendar, Clock, Smile, Frown, Meh, Search, Filter, X } from "lucide-react"
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
  const [filteredEntries, setFilteredEntries] = useState<FoodEntry[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMood, setSelectedMood] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    // Load entries from localStorage
    const savedEntries = JSON.parse(localStorage.getItem("foodEntries") || "[]")
    setEntries(savedEntries)
    setFilteredEntries(savedEntries)
  }, [])

  useEffect(() => {
    // Filter entries based on search criteria
    let filtered = entries

    // Filter by search term (food, feeling, or notes)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(entry => 
        entry.food.toLowerCase().includes(term) ||
        entry.feeling.toLowerCase().includes(term) ||
        entry.notes.toLowerCase().includes(term)
      )
    }

    // Filter by mood
    if (selectedMood !== "all") {
      filtered = filtered.filter(entry => entry.mood === selectedMood)
    }

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter(entry => {
        const entryDate = new Date(entry.date)
        const filterDate = new Date(selectedDate)
        return entryDate.toDateString() === filterDate.toDateString()
      })
    }

    setFilteredEntries(filtered)
  }, [entries, searchTerm, selectedMood, selectedDate])

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

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedMood("all")
    setSelectedDate("")
  }

  const hasActiveFilters = searchTerm || selectedMood !== "all" || selectedDate

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
              {filteredEntries.length} de {entries.length} entrada{entries.length !== 1 ? 's' : ''} mostrada{filteredEntries.length !== 1 ? 's' : ''}
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

      {/* Search and Filters */}
      <Card className="mb-6 bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-orange-400" />
              Buscar y Filtrar
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="text-gray-300 hover:text-white"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? "Ocultar" : "Mostrar"} Filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por comida, sensación o notas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Estado de ánimo
                  </label>
                  <Select value={selectedMood} onValueChange={setSelectedMood}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Seleccionar estado de ánimo" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="happy">Bien</SelectItem>
                      <SelectItem value="neutral">Regular</SelectItem>
                      <SelectItem value="sad">Mal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fecha específica
                  </label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-400">Filtros activos:</span>
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full border border-orange-500/30">
                      Búsqueda: "{searchTerm}"
                      <button
                        onClick={() => setSearchTerm("")}
                        className="ml-1 hover:text-orange-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedMood !== "all" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                      Estado: {moodLabels[selectedMood as keyof typeof moodLabels]}
                      <button
                        onClick={() => setSelectedMood("all")}
                        className="ml-1 hover:text-blue-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedDate && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30">
                      Fecha: {new Date(selectedDate).toLocaleDateString("es-ES")}
                      <button
                        onClick={() => setSelectedDate("")}
                        className="ml-1 hover:text-green-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-gray-400 hover:text-white text-xs"
                  >
                    Limpiar todos
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {filteredEntries.length === 0 && hasActiveFilters ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-12">
            <div className="text-center">
              <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No se encontraron resultados</h3>
              <p className="text-gray-400 mb-6">
                No hay entradas que coincidan con los filtros aplicados
              </p>
              <Button 
                onClick={clearFilters}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Limpiar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredEntries.map((entry) => (
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
      )}
    </AppLayout>
  )
}
