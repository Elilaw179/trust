
"use client"

import { cn } from "@/lib/utils"

interface BrandLogoProps {
  className?: string
  iconClassName?: string
}

export function BrandLogo({ className, iconClassName }: BrandLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
       <img
        src="trustlogo.jpeg" // <-- put your existing logo file name here
        alt="Brand Logo"
        className={cn("w-8 h-8 object-contain", iconClassName)}
      />
    </div>
  )
}
