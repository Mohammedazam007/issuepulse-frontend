import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'

// Public pages
import LandingPage    from './pages/LandingPage'
import LoginPage      from './pages/LoginPage'
import RegisterPage   from './pages/RegisterPage'

// Student pages
import StudentDashboard from './pages/student/StudentDashboard'
import RaiseComplaint   from './pages/student/RaiseComplaint'
import MyComplaints     from './pages/student/MyComplaints'
import ResolvedIssues   from './pages/student/ResolvedIssues'
import TrendingIssues   from './pages/student/TrendingIssues'

// Admin pages
import AdminDashboard   from './pages/admin/AdminDashboard'
import AdminComplaints  from './pages/admin/AdminComplaints'
import AdminAnalytics   from './pages/admin/AdminAnalytics'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/"          element={<LandingPage/>}/>
        <Route path="/login"     element={<LoginPage/>}/>
        <Route path="/register"  element={<RegisterPage/>}/>
        <Route path="/trending"  element={<TrendingIssues/>}/>
        <Route path="/resolved-issues" element={<ResolvedIssues/>}/>

        {/* Student (requires STUDENT role) */}
        <Route path="/dashboard" element={
          <ProtectedRoute role="STUDENT"><StudentDashboard/></ProtectedRoute>}/>
        <Route path="/raise-complaint" element={
          <ProtectedRoute role="STUDENT"><RaiseComplaint/></ProtectedRoute>}/>
        <Route path="/my-complaints" element={
          <ProtectedRoute role="STUDENT"><MyComplaints/></ProtectedRoute>}/>

        {/* Admin (requires ADMIN role) */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute role="ADMIN"><AdminDashboard/></ProtectedRoute>}/>
        <Route path="/admin/complaints" element={
          <ProtectedRoute role="ADMIN"><AdminComplaints/></ProtectedRoute>}/>
        <Route path="/admin/analytics" element={
          <ProtectedRoute role="ADMIN"><AdminAnalytics/></ProtectedRoute>}/>

        {/* Fallbacks */}
        <Route path="/unauthorized" element={
          <div className="min-h-screen flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-4xl font-bold text-red-400 mb-2">403</p>
              <p className="text-lg">You don't have access to this page.</p>
            </div>
          </div>}/>
        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
    </AuthProvider>
  )
}
