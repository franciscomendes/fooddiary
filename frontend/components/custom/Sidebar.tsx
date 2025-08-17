"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Home, BookOpen, Camera } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/",
      icon: <Home className="w-5 h-5" />,
      label: "Inicio",
    },
    {
      href: "/diary",
      icon: <BookOpen className="w-5 h-5" />,
      label: "Diario",
    },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <Camera className="w-8 h-8 text-orange-400" />
              <h1 className="text-xl font-bold text-white">FoodDiary</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <Button
                      variant={pathname === item.href ? "default" : "ghost"}
                      className={`w-full justify-start gap-3 ${
                        pathname === item.href
                          ? "bg-orange-500 hover:bg-orange-600 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          onClose()
                        }
                      }}
                    >
                      {item.icon}
                      {item.label}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            <p className="text-xs text-gray-400 text-center">
              Registra tus comidas y emociones
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
