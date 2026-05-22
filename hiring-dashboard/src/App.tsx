import { RouterProvider } from 'react-router-dom'
import { AuthProvider, ThemeProvider } from '@/context'
import { ToastProvider } from '@/hooks/useToast'
import { router } from '@/routes'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
