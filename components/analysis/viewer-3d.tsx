"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Box, 
  RotateCcw, 
  Move, 
  Maximize2,
  Eye,
  Layers,
  Sun,
  Moon,
  Palette,
  Construction
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Viewer3DProps {
  className?: string
}

export function Viewer3D({ className }: Viewer3DProps) {
  const [rotation, setRotation] = useState({ x: -20, y: 30 })
  const [isDragging, setIsDragging] = useState(false)
  
  return (
    <div className={cn("relative rounded-xl overflow-hidden", className)}>
      {/* Fake 3D viewport background */}
      <div className="relative aspect-video bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/10 rounded-xl overflow-hidden">
        {/* Grid floor */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'bottom'
          }}
        />
        
        {/* Fake 3D brain wireframe */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="relative w-64 h-64"
            animate={{ 
              rotateY: rotation.y,
              rotateX: rotation.x 
            }}
            transition={{ type: "spring", stiffness: 100 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Wireframe ellipsoid representation */}
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <defs>
                <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.4" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Outer shell */}
              <ellipse 
                cx="100" cy="100" rx="70" ry="85" 
                fill="none" 
                stroke="url(#brainGrad)" 
                strokeWidth="1.5"
                filter="url(#glow)"
              />
              
              {/* Horizontal rings */}
              {[-40, -20, 0, 20, 40].map((offset, i) => (
                <ellipse 
                  key={`h-${i}`}
                  cx="100" 
                  cy={100 + offset} 
                  rx={70 - Math.abs(offset) * 0.8} 
                  ry="15" 
                  fill="none" 
                  stroke="url(#brainGrad)" 
                  strokeWidth="0.8"
                  opacity={0.6 - Math.abs(offset) * 0.01}
                />
              ))}
              
              {/* Vertical arcs */}
              {[0, 30, 60, 90, 120, 150].map((angle, i) => (
                <ellipse 
                  key={`v-${i}`}
                  cx="100" 
                  cy="100" 
                  rx="15" 
                  ry="85" 
                  fill="none" 
                  stroke="url(#brainGrad)" 
                  strokeWidth="0.8"
                  opacity="0.5"
                  transform={`rotate(${angle} 100 100)`}
                />
              ))}
              
              {/* Internal structure hints */}
              <ellipse cx="100" cy="100" rx="25" ry="30" fill="none" stroke="#06b6d4" strokeWidth="0.5" opacity="0.4" />
              <ellipse cx="100" cy="100" rx="15" ry="18" fill="none" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.3" />
              
              {/* Axis indicators */}
              <line x1="100" y1="10" x2="100" y2="190" stroke="#22c55e" strokeWidth="0.5" opacity="0.3" />
              <line x1="25" y1="100" x2="175" y2="100" stroke="#ef4444" strokeWidth="0.5" opacity="0.3" />
            </svg>
          </motion.div>
        </div>
        
        {/* Tool palette (left side) */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 bg-black/40 backdrop-blur-sm rounded-lg p-2 border border-white/10">
          {[
            { icon: Move, label: "Move" },
            { icon: RotateCcw, label: "Rotate" },
            { icon: Maximize2, label: "Scale" },
            { icon: Eye, label: "View" },
          ].map((tool, i) => (
            <Button
              key={i}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
              title={tool.label}
            >
              <tool.icon className="w-4 h-4" />
            </Button>
          ))}
        </div>
        
        {/* View cube (top right) */}
        <div className="absolute right-3 top-3 w-16 h-16 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 flex items-center justify-center">
          <div className="w-10 h-10 border border-white/30 transform rotate-45 flex items-center justify-center">
            <span className="text-[8px] text-white/60 -rotate-45">TOP</span>
          </div>
        </div>
        
        {/* Info bar (bottom) */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-black/60 backdrop-blur-sm border-t border-white/10 flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center gap-4">
            <span>Verts: 24,847</span>
            <span>Faces: 49,152</span>
            <span>Objects: 3</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Memory: 128MB</span>
            <span>60 FPS</span>
          </div>
        </div>
        
        {/* COMING SOON Overlay */}
        <motion.div 
          className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="mb-4 mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center border border-primary/30">
              <Construction className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">3D Viewer</h3>
            <p className="text-lg text-primary font-medium mb-4">Coming Soon</p>
            <p className="text-sm text-white/60 max-w-md">
              Advanced 3D volumetric rendering with interactive manipulation, 
              similar to professional tools like Blender. Stay tuned!
            </p>
            
            {/* Feature preview list */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {["Volume Rendering", "3D Segmentation", "Surface Mesh", "VR Support"].map((feature, i) => (
                <span 
                  key={i}
                  className="px-3 py-1 text-xs bg-white/10 rounded-full text-white/70 border border-white/10"
                >
                  {feature}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
