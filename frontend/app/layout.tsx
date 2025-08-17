import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FoodDiary - Diario de Comidas',
  description: 'Registra tus comidas y cómo te hacen sentir',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
