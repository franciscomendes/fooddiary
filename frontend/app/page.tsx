"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, ActivityIcon, Heart, Smile, Frown, Meh, Camera, Upload, X, RotateCcw } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
function CameraComponent({ onCapture, onClose, devices }: { onCapture: (imageData: string) => void; onClose: () => void, devices: { deviceId: string, label: string }[] }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const startCamera = useCallback(async (selectedDeviceId?: string) => {
    try {
      setIsLoading(true)

      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null
      }

      // Build constraints based on selected device
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      }

      // If a specific device is selected, use it
      if (selectedDeviceId) {
        constraints.video = {
          ...(constraints.video as MediaTrackConstraints),
          deviceId: { exact: selectedDeviceId }
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsCameraActive(true)
      }
    } catch (error) {
      console.error('Error accessing camera:', error)

      // Try to start with default camera if specific device fails
      if (selectedDeviceId && devices.length > 0) {
        console.log('Trying default camera...')
        await startCamera()
      } else {
        alert('No se pudo acceder a la cámara. Por favor, verifica los permisos.')
      }
    } finally {
      setIsLoading(false)
    }
  }, [devices])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsCameraActive(false)
  }, [])

  const takePicture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageData = canvas.toDataURL('image/jpeg', 0.8)
        onCapture(imageData)
        stopCamera()
        onClose()
      }
    }
  }, [onCapture, onClose, stopCamera])

  const handleDeviceChange = useCallback(async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDeviceId = e.target.value
    setDeviceId(newDeviceId)
    
    // Stop current camera before switching
    stopCamera()
    
    // Start camera with new device
    if (newDeviceId) {
      await startCamera(newDeviceId)
    } else {
      // If no device selected, start with default
      await startCamera()
    }
  }, [startCamera, stopCamera])

  // Initialize with first available device or default camera
  useEffect(() => {
    if (devices.length > 0) {
      // Set first device as default
      setDeviceId(devices[0].deviceId)
      startCamera(devices[0].deviceId)
    } else {
      // Try to start with default camera
      startCamera()
    }
    
    return () => stopCamera()
  }, [devices, startCamera, stopCamera])

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-4 max-w-md w-full">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-white mb-2">Tomar Foto</h3>
          <p className="text-gray-300 text-sm mb-3">Posiciona tu comida en el encuadre</p>
        </div>
        
        {/* Dropdown menu for selecting camera device */}
        <div className="mb-4 flex items-center gap-2">
          <label htmlFor="camera-device-select" className="text-sm text-gray-300">
            Seleccionar cámara:
          </label>
          <select
            id="camera-device-select"
            className="bg-gray-700 text-gray-200 rounded px-2 py-1 text-sm border border-gray-600 focus:outline-none"
            value={deviceId || ""}
            onChange={handleDeviceChange}
            disabled={isLoading}
          >
            {devices.length > 0 ? devices.map(device => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Cámara ${device.deviceId.slice(-4)}`}
              </option>
            )) : <option value="">No hay cámaras disponibles</option>}
          </select>
        </div>

        {/* Camera container */}
        <div className="relative mb-4">
          <div className="relative overflow-hidden rounded-lg border-2 border-gray-600/50">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-64 object-cover bg-gray-900"
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Camera Loading State */}
            {(!isCameraActive || isLoading) && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-gray-300 font-medium">
                    {isLoading ? 'Cambiando cámara...' : 'Iniciando cámara...'}
                  </p>
                </div>
              </div>
            )}
            {/* Camera Status and Type Indicator */}
            <div className="absolute top-1 right-1 flex items-center gap-2 z-10">
              <div className={`w-3 h-3 rounded-full ${isCameraActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
            </div>
            {/* Camera Frame Overlay */}
            <div className="absolute inset-0 pointer-events-none z-9">
              {/* Corner Guides */}
              <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-orange-400 rounded-tl-lg"></div>
              <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-orange-400 rounded-tr-lg"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-orange-400 rounded-bl-lg"></div>
              <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-orange-400 rounded-br-lg"></div>
            </div>
          </div>
        </div>

        {/* Camera Controls */}
        <div className="flex gap-2">
          <Button
            onClick={takePicture}
            disabled={!isCameraActive || isLoading}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Camera className="w-4 h-4 mr-2" />
            Capturar
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function FoodDiaryApp() {
  const [entries, setEntries] = useState<FoodEntry[]>([])
  const [food, setFood] = useState("")
  const [feeling, setFeeling] = useState("")
  const [notes, setNotes] = useState("")
  const [mood, setMood] = useState<"happy" | "neutral" | "sad">("neutral")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [videoDevices, setVideoDevices] = useState<{ deviceId: string, label: string }[]>([])

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      setVideoDevices(devices.filter((device) => device.kind === 'videoinput').map((device) => ({ deviceId: device.deviceId, label: device.label })))
    })
  }, [])

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
          devices={videoDevices}
        />
      )}
    </div>
  )
}
