"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Home, FileText, Crown, ArrowLeft, MessageSquare } from "lucide-react"
import { ModernLogo } from "./modern-logo"

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? "auto" : "hidden"
  }

  const closeMenu = () => {
    setIsOpen(false)
    document.body.style.overflow = "auto"
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 text-white hover:text-red-400 transition-colors z-50 relative"
        aria-label="Toggle mobile menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile menu overlay */}
      <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
        <div className="mobile-menu-content">
          {/* Logo */}
          <div className="mb-8">
            <ModernLogo size="md" animated={true} />
            <div className="text-center mt-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                Unified Realms
              </span>
              <div className="text-xs text-red-400/70 font-medium tracking-wider">ALLIANCE</div>
            </div>
          </div>

          {/* Navigation items */}
          <nav className="flex flex-col items-center space-y-6">
            <Link href="/" onClick={closeMenu} className="mobile-menu-item flex items-center">
              <Home className="w-5 h-5 mr-3" />
              Home
            </Link>
            <Link href="/apply" onClick={closeMenu} className="mobile-menu-item flex items-center">
              <Crown className="w-5 h-5 mr-3" />
              Apply
            </Link>
            <Link href="/terms" onClick={closeMenu} className="mobile-menu-item flex items-center">
              <FileText className="w-5 h-5 mr-3" />
              Terms
            </Link>
            <a
              href="https://discord.gg/yXTrkPPQAK"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="mobile-menu-item flex items-center"
            >
              <MessageSquare className="w-5 h-5 mr-3" />
              Discord HQ
            </a>

            {/* Divider */}
            <div className="w-16 h-px bg-red-900/30 my-4"></div>

            {/* Back to Main */}
            <button
              onClick={() => {
                closeMenu()
                window.history.back()
              }}
              className="mobile-menu-item flex items-center text-gray-400 hover:text-red-300"
            >
              <ArrowLeft className="w-5 h-5 mr-3" />
              Go Back
            </button>
          </nav>

          {/* CTA Button */}
          <div className="mt-8">
            <Link
              href="/apply"
              onClick={closeMenu}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center"
            >
              <Crown className="w-5 h-5 mr-2" />
              Join Alliance
            </Link>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-[9997] md:hidden" onClick={closeMenu} />}

      <style jsx>{`
        .mobile-menu {
          position: fixed;
          top: 0;
          right: -100%;
          width: 100%;
          max-width: 400px;
          height: 100vh;
          background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
          border-left: 1px solid rgba(220, 38, 38, 0.3);
          z-index: 9998;
          transition: right 0.3s ease-in-out;
          overflow-y: auto;
        }

        .mobile-menu.open {
          right: 0;
        }

        .mobile-menu-content {
          padding: 2rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .mobile-menu-item {
          color: #e5e7eb;
          font-size: 1.125rem;
          font-weight: 500;
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          transition: all 0.3s ease;
          text-decoration: none;
          border: 1px solid transparent;
        }

        .mobile-menu-item:hover {
          color: #fca5a5;
          background: rgba(220, 38, 38, 0.1);
          border-color: rgba(220, 38, 38, 0.3);
          transform: translateX(4px);
        }

        @media (min-width: 768px) {
          .mobile-menu {
            display: none;
          }
        }
      `}</style>
    </>
  )
}
