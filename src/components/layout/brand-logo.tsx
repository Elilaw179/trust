
"use client"

import { cn } from "@/lib/utils"

interface BrandLogoProps {
  className?: string
  iconClassName?: string
}

export function BrandLogo({ className, iconClassName }: BrandLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 100 100"
        className={cn("w-8 h-8", iconClassName)}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Eye Outer */}
        <path
          d="M10 50C10 50 25 20 50 20C75 20 90 50 90 50C90 50 75 80 50 80C25 80 10 50 10 50Z"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        />
        {/* Shield Inside */}
        <path
          d="M50 35C50 35 40 38 40 45V55C40 62 50 68 50 68C50 68 60 62 60 55V45C60 38 50 35 50 35Z"
          fill="currentColor"
          className="text-accent"
        />
        {/* Lock on Shield */}
        <rect x="47" y="48" width="6" height="5" rx="1" fill="white" />
        <path
          d="M48 48V46C48 44.8954 48.8954 44 50 44C51.1046 44 52 44.8954 52 46V48"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Pixel Detail */}
        <rect x="5" y="45" width="4" height="4" fill="currentColor" className="text-accent" />
        <rect x="0" y="50" width="3" height="3" fill="currentColor" className="text-primary" />
        <rect x="6" y="55" width="3" height="3" fill="currentColor" className="text-primary" />
      </svg>
    </div>
  )
}
