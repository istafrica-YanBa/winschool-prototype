import { ref } from 'vue'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  persistent?: boolean
}

const toasts = ref<Toast[]>([])

let toastId = 0

export const useToast = () => {
  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${++toastId}`
    const newToast: Toast = {
      id,
      duration: 5000,
      persistent: false,
      ...toast
    }
    
    toasts.value.push(newToast)
    
    if (!newToast.persistent && newToast.duration) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }
    
    return id
  }
  
  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  const clearToasts = () => {
    toasts.value = []
  }
  
  const success = (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => {
    return addToast({ message, type: 'success', ...options })
  }
  
  const error = (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => {
    return addToast({ message, type: 'error', persistent: true, ...options })
  }
  
  const warning = (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => {
    return addToast({ message, type: 'warning', ...options })
  }
  
  const info = (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => {
    return addToast({ message, type: 'info', ...options })
  }
  
  return {
    toasts: toasts.value,
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info
  }
} 