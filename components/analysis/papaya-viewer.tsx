"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Maximize2,
  Grid3X3,
  Layers,
  FileImage,
  AlertCircle,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PapayaViewerProps {
  className?: string
  files?: AnalysedFile[]
  activeFileId?: string | null
  onFileSelect?: (fileId: string) => void
}

export interface AnalysedFile {
  id: string
  name: string
  sequence?: string
  url?: string
  file?: File
}

declare global {
  interface Window {
    papaya: {
      Container: {
        addViewer: (id: string, params: unknown, callback?: () => void) => void
        removeViewer: (index: number) => void
        resetViewer: (index: number, params?: unknown) => void
      }
      viewer: {
        Viewer: unknown[]
      }
    }
    papayaContainers: unknown[]
  }
}

export function PapayaViewer({ 
  className, 
  files = [],
  activeFileId,
  onFileSelect 
}: PapayaViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [layout, setLayout] = useState<"grid" | "single">("grid")
  const papayaInitialized = useRef(false)
  const viewerInstanceRef = useRef<number | null>(null)

  // Load Papaya scripts from local public folder
  useEffect(() => {
    if (papayaInitialized.current) return

    const loadPapaya = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Load CSS from local public folder
        if (!document.querySelector('link[href="/papaya/papaya.css"]')) {
          const cssLink = document.createElement('link')
          cssLink.rel = 'stylesheet'
          cssLink.type = 'text/css'
          cssLink.href = '/papaya/papaya.css'
          document.head.appendChild(cssLink)
        }

        // Load JS from local public folder
        if (!window.papaya) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script')
            script.src = '/papaya/papaya.js'
            script.async = true
            script.onload = () => {
              // Give papaya a moment to initialize its global objects
              setTimeout(resolve, 100)
            }
            script.onerror = () => reject(new Error('Failed to load Papaya viewer library'))
            document.body.appendChild(script)
          })
        }

        papayaInitialized.current = true
        setIsLoaded(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load viewer')
      } finally {
        setIsLoading(false)
      }
    }

    loadPapaya()
  }, [])

  // Initialize viewer when Papaya is loaded
  useEffect(() => {
    if (!isLoaded || !containerRef.current) return

    // Clear previous viewer content
    const container = containerRef.current
    const existingPapaya = container.querySelector('.papaya')
    if (existingPapaya) {
      existingPapaya.remove()
    }

    // Create papaya container element
    const papayaDiv = document.createElement('div')
    papayaDiv.className = 'papaya'
    papayaDiv.id = 'papayaViewer'
    papayaDiv.setAttribute('data-params', JSON.stringify({
      fullScreen: false,
      kioskMode: false,
      showControls: true,
      showControlBar: true,
      showImageButtons: true,
      orthogonal: true,
      mainView: 'axial',
      combineParametric: true,
      smoothDisplay: false
    }))
    container.appendChild(papayaDiv)

    // Initialize Papaya viewer
    if (window.papaya && window.papaya.Container) {
      try {
        // Reset papaya containers array if needed
        if (!window.papayaContainers) {
          window.papayaContainers = []
        }
        
        window.papaya.Container.addViewer('papayaViewer', {
          fullScreen: false,
          kioskMode: false,
          showControls: true,
          showControlBar: true,
          showImageButtons: true,
          orthogonal: true,
          combineParametric: true
        })
        
        viewerInstanceRef.current = window.papayaContainers.length - 1
      } catch (e) {
        console.log('[v0] Papaya viewer initialization error:', e)
      }
    }

    return () => {
      // Cleanup on unmount
      if (viewerInstanceRef.current !== null && window.papaya?.Container?.removeViewer) {
        try {
          window.papaya.Container.removeViewer(viewerInstanceRef.current)
        } catch {
          // Viewer may already be removed
        }
      }
    }
  }, [isLoaded])

  // Load active file into viewer
  useEffect(() => {
    if (!isLoaded || !activeFileId) return

    const activeFile = files.find(f => f.id === activeFileId)
    if (!activeFile) return

    const viewerIndex = viewerInstanceRef.current ?? 0

    // Load the file into Papaya
    if (activeFile.url && window.papaya && window.papayaContainers?.[viewerIndex]) {
      try {
        window.papaya.Container.resetViewer(viewerIndex, {
          images: [activeFile.url],
          showControls: true,
          showControlBar: true,
          orthogonal: true
        })
      } catch (e) {
        console.log('[v0] Could not load file into Papaya:', e)
      }
    } else if (activeFile.file && window.papaya && window.papayaContainers?.[viewerIndex]) {
      // For File objects, create object URL
      const objectUrl = URL.createObjectURL(activeFile.file)
      try {
        window.papaya.Container.resetViewer(viewerIndex, {
          images: [objectUrl],
          showControls: true,
          showControlBar: true,
          orthogonal: true
        })
      } catch (e) {
        console.log('[v0] Could not load file into Papaya:', e)
      }
    }
  }, [isLoaded, activeFileId, files])

  const resetView = useCallback(() => {
    const viewerIndex = viewerInstanceRef.current ?? 0
    if (window.papaya && window.papayaContainers?.[viewerIndex]) {
      try {
        window.papaya.Container.resetViewer(viewerIndex)
      } catch {
        // Viewer might not be fully initialized
      }
    }
  }, [])

  if (error) {
    return (
      <div className={cn("flex flex-col items-center justify-center min-h-100 bg-black/40 rounded-xl border border-white/10", className)}>
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <p className="text-destructive font-medium">Erreur de chargement</p>
        <p className="text-sm text-muted-foreground mt-2">{error}</p>
      </div>
    )
  }

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
            Vue Grille
          </Button>
          <Button
            variant={layout === "single" ? "default" : "outline"}
            size="sm"
            onClick={() => setLayout("single")}
            className="gap-2"
          >
            <Maximize2 className="w-4 h-4" />
            Vue Simple
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" title="Zoom arriere">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground w-12 text-center">100%</span>
          <Button variant="outline" size="icon" title="Zoom avant">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={resetView} title="Reinitialiser">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* File list (if files are provided) */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-black/20 rounded-lg border border-white/10">
          <span className="text-xs text-muted-foreground self-center mr-2">Fichiers analyses:</span>
          {files.map((file) => (
            <Button
              key={file.id}
              variant={activeFileId === file.id ? "default" : "outline"}
              size="sm"
              onClick={() => onFileSelect?.(file.id)}
              className="gap-2 text-xs"
            >
              <FileImage className="w-3 h-3" />
              {file.name}
              {file.sequence && (
                <span className="px-1.5 py-0.5 bg-primary/20 rounded text-[10px] uppercase">
                  {file.sequence}
                </span>
              )}
            </Button>
          ))}
        </div>
      )}

      {/* Papaya container */}
      <div className="relative rounded-xl overflow-hidden bg-black border border-white/10">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-muted-foreground">Chargement du visualiseur Papaya...</span>
            </div>
          </div>
        )}
        
        <div 
          ref={containerRef}
          className={cn(
            "min-h-100 md:min-h-125",
            layout === "single" && "min-h-150"
          )}
          style={{
            background: '#000'
          }}
        />

        {/* Overlay when no file is selected */}
        {isLoaded && files.length > 0 && !activeFileId && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="text-center p-6">
              <FileImage className="w-12 h-12 text-primary mx-auto mb-4 opacity-60" />
              <h3 className="text-lg font-semibold mb-2">Selectionnez un fichier</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Cliquez sur un fichier dans la liste ci-dessus pour le visualiser
              </p>
            </div>
          </div>
        )}

        {/* Demo overlay when no files */}
        {isLoaded && files.length === 0 && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Layers className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Visualiseur Papaya</h3>
              <p className="text-muted-foreground text-sm max-w-xs mb-4">
                Televersez des fichiers DICOM ou NIfTI pour les visualiser.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 text-amber-400 rounded-full text-xs">
                <Clock className="w-3 h-3" />
                Formats supportes: NIfTI (.nii, .nii.gz), DICOM
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info panel */}
      <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-muted rounded text-xs">Scroll</kbd>
          <span>Naviguer les coupes</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-muted rounded text-xs">Clic</kbd>
          <span>Crosshair</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-muted rounded text-xs">Glisser</kbd>
          <span>Fenetre/Niveau</span>
        </div>
      </div>
    </div>
  )
}
