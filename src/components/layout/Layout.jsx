import Sidebar from './Navbar'
import { Toaster } from 'react-hot-toast'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 min-w-0 ml-0 md:ml-64 transition-all duration-300">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter">
          {children}
        </main>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '13px',
            fontWeight: '500',
            borderRadius: '12px',
            border: '1px solid #e8ecf8',
            boxShadow: '0 10px 30px rgba(79,70,229,0.12)',
          },
          success: { iconTheme: { primary: '#10B981', secondary: 'white' } },
          error:   { iconTheme: { primary: '#EF4444', secondary: 'white' } },
        }}
      />
    </div>
  )
}
