"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Maximize2,
  Grid3X3,
  Layers
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface MRI2DViewerProps {
  totalSlices?: number
  className?: string
}

type PlaneType = "axial" | "sagittal" | "coronal"

interface PlaneConfig {
  name: string
  label: string
  color: string
  description: string
}

const planeConfigs: Record<PlaneType, PlaneConfig> = {
  axial: {
    name: "Axial",
    label: "AX",
    color: "from-cyan-500 to-blue-500",
    description: "Top-down view (horizontal cross-section)"
  },
  sagittal: {
    name: "Sagittal", 
    label: "SAG",
    color: "from-emerald-500 to-teal-500",
    description: "Side view (left-right division)"
  },
  coronal: {
    name: "Coronal",
    label: "COR", 
    color: "from-amber-500 to-orange-500",
    description: "Front view (front-back division)"
  }
}

// Generate fake MRI slice data
const generateSlicePattern = (plane: PlaneType, slice: number, total: number) => {
  const progress = slice / total
  const patterns: Record<PlaneType, { cx: number; cy: number; rx: number; ry: number }> = {
    axial: { cx: 50, cy: 50, rx: 35 - Math.abs(progress - 0.5) * 20, ry: 40 - Math.abs(progress - 0.5) * 25 },
    sagittal: { cx: 50, cy: 50, rx: 30 - Math.abs(progress - 0.5) * 15, ry: 45 - Math.abs(progress - 0.5) * 20 },
    coronal: { cx: 50, cy: 50, rx: 38 - Math.abs(progress - 0.5) * 22, ry: 42 - Math.abs(progress - 0.5) * 18 }
  }
  return patterns[plane]
}

function MRISlice({ plane, slice, total, zoom }: { plane: PlaneType; slice: number; total: number; zoom: number }) {
  const pattern = generateSlicePattern(plane, slice, total)
  const config = planeConfigs[plane]
  
  return (
    <svg 
      viewBox="0 0 100 100" 
      className="w-full h-full"
      style={{ transform: `scale(${zoom})` }}
    >
      {/* Background */}
      <rect width="100" height="100" fill="#0a0a0a" />
      
      {/* Outer skull */}
      <ellipse 
        cx={pattern.cx} 
        cy={pattern.cy} 
        rx={pattern.rx + 8} 
        ry={pattern.ry + 6} 
        fill="#1a1a2e"
        stroke="#2a2a4e"
        strokeWidth="0.5"
      />
      
      {/* Brain tissue outer */}
      <ellipse 
        cx={pattern.cx} 
        cy={pattern.cy} 
        rx={pattern.rx + 3} 
        ry={pattern.ry + 2} 
        fill="#2d2d4a"
      />
      
      {/* Brain tissue inner */}
      <ellipse 
        cx={pattern.cx} 
        cy={pattern.cy} 
        rx={pattern.rx} 
        ry={pattern.ry} 
        fill="#3d3d5c"
      />
      
      {/* White matter */}
      <ellipse 
        cx={pattern.cx} 
        cy={pattern.cy - 2} 
        rx={pattern.rx * 0.7} 
        ry={pattern.ry * 0.6} 
        fill="#4a4a6a"
      />
      
      {/* Ventricles (if middle slices) */}
      {slice > total * 0.3 && slice < total * 0.7 && (
        <>
          <ellipse 
            cx={pattern.cx - 8} 
            cy={pattern.cy} 
            rx={4} 
            ry={8} 
            fill="#1a1a2e"
          />
          <ellipse 
            cx={pattern.cx + 8} 
            cy={pattern.cy} 
            rx={4} 
            ry={8} 
            fill="#1a1a2e"
          />
        </>
      )}
      
      {/* Midline (for sagittal) */}
      {plane === "sagittal" && (
        <path 
          d={`M ${pattern.cx} ${pattern.cy - pattern.ry} Q ${pattern.cx + 5} ${pattern.cy} ${pattern.cx} ${pattern.cy + pattern.ry}`}
          stroke="#5a5a7a"
          strokeWidth="0.8"
          fill="none"
        />
      )}
      
      {/* Grid overlay */}
      <g opacity="0.1">
        {[20, 40, 60, 80].map(pos => (
          <g key={pos}>
            <line x1={pos} y1="0" x2={pos} y2="100" stroke="white" strokeWidth="0.2" />
            <line x1="0" y1={pos} x2="100" y2={pos} stroke="white" strokeWidth="0.2" />
          </g>
        ))}
      </g>
      
      {/* Slice info overlay */}
      <text x="5" y="10" fill="white" fontSize="4" fontFamily="monospace" opacity="0.7">
        {config.label}
      </text>
      <text x="5" y="95" fill="white" fontSize="3" fontFamily="monospace" opacity="0.5">
        Slice {slice}/{total}
      </text>
    </svg>
  )
}

function PlaneViewer({ 
  plane, 
  currentSlice, 
  totalSlices,
  onSliceChange,
  zoom,
  isActive,
  onActivate
}: { 
  plane: PlaneType
  currentSlice: number
  totalSlices: number
  onSliceChange: (slice: number) => void
  zoom: number
  isActive: boolean
  onActivate: () => void
}) {
  const config = planeConfigs[plane]
  
  const handleScroll = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 1 : -1
    const newSlice = Math.max(1, Math.min(totalSlices, currentSlice + delta))
    onSliceChange(newSlice)
  }, [currentSlice, totalSlices, onSliceChange])
  
  return (
    <div 
      className={cn(
        "relative flex flex-col rounded-xl overflow-hidden transition-all duration-300",
        "bg-black/40 backdrop-blur-sm border",
        isActive ? "border-primary ring-2 ring-primary/30" : "border-white/10 hover:border-white/20"
      )}
      onClick={onActivate}
    >
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between px-3 py-2 bg-gradient-to-r",
        config.color,
        "bg-opacity-20"
      )}>
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full bg-gradient-to-r",
            config.color
          )} />
          <span className="text-sm font-medium text-white">{config.name}</span>
        </div>
        <span className="text-xs text-white/60">{currentSlice}/{totalSlices}</span>
      </div>
      
      {/* Viewer area */}
      <div 
        className="relative aspect-square bg-black overflow-hidden cursor-pointer"
        onWheel={handleScroll}
      >
        <MRISlice 
          plane={plane} 
          slice={currentSlice} 
          total={totalSlices}
          zoom={zoom}
        />
        
        {/* Scroll hint */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 text-white/40 text-xs">
          <Layers className="w-3 h-3" />
          <span>Scroll to navigate</span>
        </div>
      </div>
      
      {/* Slider control */}
      <div className="px-3 py-2 bg-black/20">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white/60 hover:text-white"
            onClick={(e) => {
              e.stopPropagation()
              onSliceChange(Math.max(1, currentSlice - 1))
            }}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Slider
            value={[currentSlice]}
            min={1}
            max={totalSlices}
            step={1}
            onValueChange={([value]) => onSliceChange(value)}
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white/60 hover:text-white"
            onClick={(e) => {
              e.stopPropagation()
              onSliceChange(Math.min(totalSlices, currentSlice + 1))
            }}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function MRI2DViewer({ totalSlices = 120, className }: MRI2DViewerProps) {
  const [slices, setSlices] = useState<Record<PlaneType, number>>({
    axial: 60,
    sagittal: 60,
    coronal: 60
  })
  const [zoom, setZoom] = useState(1)
  const [activePlane, setActivePlane] = useState<PlaneType>("axial")
  const [layout, setLayout] = useState<"grid" | "single">("grid")
  
  const handleSliceChange = useCallback((plane: PlaneType, slice: number) => {
    setSlices(prev => ({ ...prev, [plane]: slice }))
  }, [])
  
  const resetView = () => {
    setSlices({ axial: 60, sagittal: 60, coronal: 60 })
    setZoom(1)
  }
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault()
        const delta = e.key === "ArrowUp" ? -1 : 1
        setSlices(prev => ({
          ...prev,
          [activePlane]: Math.max(1, Math.min(totalSlices, prev[activePlane] + delta))
        }))
      }
    }
    
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activePlane, totalSlices])
  
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={layout === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setLayout("grid")}
            className="gap-2"
          >
            <Grid3X3 className="w-4 h-4" />
            Grid View
          </Button>
          <Button
            variant={layout === "single" ? "default" : "outline"}
            size="sm"
            onClick={() => setLayout("single")}
            className="gap-2"
          >
            <Maximize2 className="w-4 h-4" />
            Single View
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
            disabled={zoom <= 0.5}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoom(z => Math.min(2, z + 0.25))}
            disabled={zoom >= 2}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={resetView}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Viewers */}
      <AnimatePresence mode="wait">
        {layout === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {(Object.keys(planeConfigs) as PlaneType[]).map(plane => (
              <PlaneViewer
                key={plane}
                plane={plane}
                currentSlice={slices[plane]}
                totalSlices={totalSlices}
                onSliceChange={(slice) => handleSliceChange(plane, slice)}
                zoom={zoom}
                isActive={activePlane === plane}
                onActivate={() => setActivePlane(plane)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="single"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4"
          >
            {/* Plane selector tabs */}
            <div className="flex gap-2 justify-center">
              {(Object.keys(planeConfigs) as PlaneType[]).map(plane => {
                const config = planeConfigs[plane]
                return (
                  <Button
                    key={plane}
                    variant={activePlane === plane ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActivePlane(plane)}
                    className={cn(
                      "gap-2",
                      activePlane === plane && `bg-gradient-to-r ${config.color}`
                    )}
                  >
                    {config.name}
                  </Button>
                )
              })}
            </div>
            
            {/* Single large viewer */}
            <div className="max-w-2xl mx-auto w-full">
              <PlaneViewer
                plane={activePlane}
                currentSlice={slices[activePlane]}
                totalSlices={totalSlices}
                onSliceChange={(slice) => handleSliceChange(activePlane, slice)}
                zoom={zoom}
                isActive={true}
                onActivate={() => {}}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Info panel */}
      <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-muted rounded text-xs">Scroll</kbd>
          <span>Navigate slices</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-muted rounded text-xs">Arrow keys</kbd>
          <span>Fine control</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-muted rounded text-xs">Click</kbd>
          <span>Select plane</span>
        </div>
      </div>
    </div>
  )
}
