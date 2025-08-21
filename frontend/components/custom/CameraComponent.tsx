'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Camera } from 'lucide-react'
import { useVideoDevices } from '@/hooks/use-video-devices'

export default function CameraComponent({ onCapture, onClose }: { onCapture: (imageData: string) => void; onClose: () => void }) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const [isCameraActive, setIsCameraActive] = useState(false)
    const [deviceId, setDeviceId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isCameraPermissionGranted, setIsCameraPermissionGranted] = useState(false)
    const videoDevices = useVideoDevices()

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
        if (selectedDeviceId && videoDevices.length > 0) {
          console.log('Trying default camera...')
          await startCamera()
        } else {
          alert('No se pudo acceder a la cámara. Por favor, verifica los permisos.')
        }
      } finally {
        setIsLoading(false)
      }
    }, [videoDevices])
  
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
      if (videoDevices.length > 0) {
        // Set first device as default
        setDeviceId(videoDevices[0].deviceId)
        startCamera(videoDevices[0].deviceId)
      } else {
        // Try to start with default camera
        startCamera()
      }
      
      return () => stopCamera()
    }, [videoDevices, startCamera, stopCamera])
  
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
              {videoDevices.length > 0 ? videoDevices.map(device => (
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
              className="flex-1 border-gray-600 text-black-300 hover:bg-gray-700"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    )
  }
  