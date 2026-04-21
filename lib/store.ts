import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'colorblind'
export type Language = 'en' | 'fr' | 'ar'

interface AppState {
  theme: Theme
  language: Language
  sidebarOpen: boolean
  setTheme: (theme: Theme) => void
  setLanguage: (language: Language) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      language: 'en',
      sidebarOpen: true,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'medvision-preferences',
      partialize: (state) => ({ 
        theme: state.theme, 
        language: state.language,
        sidebarOpen: state.sidebarOpen 
      }),
    }
  )
)

// Upload state
interface UploadState {
  currentStep: number
  patientInfo: {
    patientId: string
    fullName: string
    dateOfBirth: string
    gender: string
  } | null
  scanInfo: {
    modality: string
    bodyPart: string
    scanDate: string
    notes: string
  } | null
  files: File[]
  uploadProgress: number
  isUploading: boolean
  setCurrentStep: (step: number) => void
  setPatientInfo: (info: UploadState['patientInfo']) => void
  setScanInfo: (info: UploadState['scanInfo']) => void
  setFiles: (files: File[]) => void
  setUploadProgress: (progress: number) => void
  setIsUploading: (uploading: boolean) => void
  reset: () => void
}

export const useUploadStore = create<UploadState>((set) => ({
  currentStep: 0,
  patientInfo: null,
  scanInfo: null,
  files: [],
  uploadProgress: 0,
  isUploading: false,
  setCurrentStep: (step) => set({ currentStep: step }),
  setPatientInfo: (info) => set({ patientInfo: info }),
  setScanInfo: (info) => set({ scanInfo: info }),
  setFiles: (files) => set({ files }),
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  setIsUploading: (uploading) => set({ isUploading: uploading }),
  reset: () => set({
    currentStep: 0,
    patientInfo: null,
    scanInfo: null,
    files: [],
    uploadProgress: 0,
    isUploading: false,
  }),
}))

// Auth state (demo mode - no real database)
interface DemoUser {
  id: string
  email: string
  fullName: string
  role: string
  institution: string
  avatarUrl?: string
}

interface AuthState {
  user: DemoUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (data: { email: string; password: string; fullName: string; role: string; institution: string }) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

// Demo users for testing
const demoUsers: Record<string, { password: string; user: DemoUser }> = {
  'demo@medvision.ai': {
    password: 'demo123',
    user: {
      id: 'demo-user-001',
      email: 'demo@medvision.ai',
      fullName: 'Dr. Sarah Johnson',
      role: 'radiologist',
      institution: 'MedVision Medical Center',
    },
  },
  'admin@hospital.com': {
    password: 'admin123',
    user: {
      id: 'demo-user-002',
      email: 'admin@hospital.com',
      fullName: 'Dr. Michael Chen',
      role: 'hospital',
      institution: 'City General Hospital',
    },
  },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        const demoUser = demoUsers[email.toLowerCase()]
        
        // Allow any email/password combo in demo mode
        if (demoUser && demoUser.password === password) {
          set({ user: demoUser.user, isAuthenticated: true })
          return { success: true }
        }
        
        // For demo purposes, accept any valid-looking email with password "demo123"
        if (password === 'demo123' && email.includes('@')) {
          const newUser: DemoUser = {
            id: `demo-user-${Date.now()}`,
            email: email.toLowerCase(),
            fullName: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            role: 'radiologist',
            institution: 'Demo Hospital',
          }
          set({ user: newUser, isAuthenticated: true })
          return { success: true }
        }
        
        return { success: false, error: 'Invalid email or password. Try demo@medvision.ai / demo123' }
      },
      signup: async (data) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const newUser: DemoUser = {
          id: `demo-user-${Date.now()}`,
          email: data.email.toLowerCase(),
          fullName: data.fullName,
          role: data.role,
          institution: data.institution || 'Independent Practice',
        }
        set({ user: newUser, isAuthenticated: true })
        return { success: true }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: 'medvision-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)

// Viewer state
interface ViewerState {
  selectedScanId: string | null
  viewMode: '2d' | '3d'
  sliceIndex: number
  windowLevel: { center: number; width: number }
  zoom: number
  annotations: Array<{
    id: string
    type: 'region' | 'point' | 'measurement'
    data: Record<string, unknown>
    label: string
  }>
  setSelectedScanId: (id: string | null) => void
  setViewMode: (mode: '2d' | '3d') => void
  setSliceIndex: (index: number) => void
  setWindowLevel: (wl: { center: number; width: number }) => void
  setZoom: (zoom: number) => void
  addAnnotation: (annotation: ViewerState['annotations'][0]) => void
  removeAnnotation: (id: string) => void
  clearAnnotations: () => void
}

export const useViewerStore = create<ViewerState>((set) => ({
  selectedScanId: null,
  viewMode: '3d',
  sliceIndex: 0,
  windowLevel: { center: 40, width: 400 },
  zoom: 1,
  annotations: [],
  setSelectedScanId: (id) => set({ selectedScanId: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSliceIndex: (index) => set({ sliceIndex: index }),
  setWindowLevel: (wl) => set({ windowLevel: wl }),
  setZoom: (zoom) => set({ zoom }),
  addAnnotation: (annotation) => set((state) => ({ 
    annotations: [...state.annotations, annotation] 
  })),
  removeAnnotation: (id) => set((state) => ({ 
    annotations: state.annotations.filter((a) => a.id !== id) 
  })),
  clearAnnotations: () => set({ annotations: [] }),
}))
