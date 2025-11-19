'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavBar() {
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/10 p-2 z-50">
            <div className="flex justify-around items-center">
                <Link
                    href="/"
                    className={`flex flex-col items-center p-2 rounded-lg transition-colors ${isActive('/') ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <span className="text-xl mb-1">🏠</span>
                    <span className="text-[10px] font-medium">Home</span>
                </Link>

                <Link
                    href="/history"
                    className={`flex flex-col items-center p-2 rounded-lg transition-colors ${isActive('/history') ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <span className="text-xl mb-1">📅</span>
                    <span className="text-[10px] font-medium">History</span>
                </Link>

                <Link
                    href="/settings"
                    className={`flex flex-col items-center p-2 rounded-lg transition-colors ${isActive('/settings') ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <span className="text-xl mb-1">⚙️</span>
                    <span className="text-[10px] font-medium">Settings</span>
                </Link>
            </div>
        </nav>
    )
}
