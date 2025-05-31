import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom"

const navLinkStyles = cva(
  "text-muted-foreground transition-colors hover:text-primary flex items-center gap-2",
  {
    variants: {
      active: {
        true: "text-orange-600 font-semibold",
        false: ""
      }
    }
  }
)

export function NavLink({ className, ...props }: NavLinkProps) {
  return (
    <RouterNavLink
      {...props}
      className={({ isActive }) =>
        cn(navLinkStyles({ active: isActive }), className)
      }
    />
  )
}
