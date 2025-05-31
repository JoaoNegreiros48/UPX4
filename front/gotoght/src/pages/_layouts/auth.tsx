import { Timer } from 'lucide-react'
import { Outlet, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background antialiased">
      {/* Topbar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted shadow-sm">
        <div className="flex items-center gap-2 text-foreground text-base font-semibold">
          <Timer className="h-5 w-5" />
          Mobile.App
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Rodapé */}
      <footer className="text-xs text-muted-foreground text-center py-4 border-t border-border">
        &copy; {new Date().getFullYear()} Mobile.App – Todos os direitos reservados
      </footer>
    </div>
  )
}
