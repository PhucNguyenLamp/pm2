import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'leaflet/dist/leaflet.css'
import './index.css'
import App from './App.jsx'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
// react router dom
import { RouterProvider } from 'react-router-dom'
import router from './routes/index.jsx'
import { AuthProvider } from './contexts/AuthContext'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeProviderWrapper } from './contexts/ThemeContext'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProviderWrapper>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router}>
            <App />
          </RouterProvider>
        </QueryClientProvider>
      </ThemeProviderWrapper>
    </AuthProvider>
  </StrictMode>,
)
