import { useEffect, useState } from "react"

// Use a custom hook to fetch video devices
export const useVideoDevices = () => {
    const [videoDevices, setVideoDevices] = useState<{ deviceId: string, label: string }[]>([])
    useEffect(() => {
       navigator.mediaDevices?.enumerateDevices().then((devices: any) => {
            setVideoDevices(
                devices
                    .filter((device: any) => device.kind === 'videoinput')
                    .map((device: any) => ({
                        deviceId: device.deviceId,
                        label: device.label
                    }))
            )
        })
    }, [])
    return videoDevices
}
