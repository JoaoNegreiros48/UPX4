import { Separator } from '@radix-ui/react-separator'
import { CalendarDays, FileText, Home, Settings, Timer } from 'lucide-react'
import { ThemeToggle } from './theme/theme-toggle'
import { NavLink } from './nav-link'
import { AccountMenu } from './account-menu'

export function Header() {
    return (
        <div className="border-b">
            <div className="flex h-16 items-center gap-6 px-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-orange-100 dark:bg-orange-900 p-2">
                    <Timer className="w-6 h-6 text-orange-600 dark:text-orange-300" />
                </div>


                <Separator orientation="vertical" className="h-6" />

                <nav className="flex items-center space-x-4 lg:space-x-6">
                    <NavLink to="/">
                        <Home className="h-4 w-4" />
                    </NavLink>
                    <NavLink to="/my-records">
                        <CalendarDays className="h-4 w-4" />
                    </NavLink>
                    <NavLink to="/adjustment-request">
                        <FileText className="h-4 w-4" />
                    </NavLink>
                    <NavLink to="/user-config">
                        <Settings className="h-4 w-4" />
                    </NavLink>
                </nav>

                <div className="ml-auto flex items-center gap-2">
                    <ThemeToggle />
                    <AccountMenu />
                </div>
            </div>
        </div>
    )
}