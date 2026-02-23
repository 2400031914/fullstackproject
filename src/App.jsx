import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext.jsx'
import { ROLES } from './contexts/AuthContext.jsx'
import { RouteGuard } from './routes/RouteGuard.jsx'
import { ToastContainer } from './components/Toast.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import RegisterPage from './pages/auth/RegisterPage.jsx'
import { DashboardLayout } from './layouts/DashboardLayout.jsx'
import StudentDashboard from './pages/student/StudentDashboard.jsx'
import StudentCourses from './pages/student/StudentCourses.jsx'
import StudentCourseDetail from './pages/student/StudentCourseDetail.jsx'
import StudentAssignments from './pages/student/StudentAssignments.jsx'
import StudentProgress from './pages/student/StudentProgress.jsx'
import InstructorDashboard from './pages/instructor/InstructorDashboard.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import ContentDashboard from './pages/content/ContentDashboard.jsx'

const DASHBOARD_BY_ROLE = {
  [ROLES.STUDENT]: '/student/dashboard',
  [ROLES.INSTRUCTOR]: '/instructor/dashboard',
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.CONTENT]: '/content/dashboard',
}

function RootRedirect() {
  const { user, isAuthenticated } = useAuth()
  if (isAuthenticated && user) {
    const dest = DASHBOARD_BY_ROLE[user.role] || '/login'
    return <Navigate to={dest} replace />
  }
  return <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/student" element={<RouteGuard allowedRoles={[ROLES.STUDENT]}><DashboardLayout role="student" /></RouteGuard>}>
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="courses/:id" element={<StudentCourseDetail />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="progress" element={<StudentProgress />} />
        </Route>

        <Route path="/instructor" element={<RouteGuard allowedRoles={[ROLES.INSTRUCTOR]}><DashboardLayout role="instructor" /></RouteGuard>}>
          <Route index element={<Navigate to="/instructor/dashboard" replace />} />
          <Route path="dashboard" element={<InstructorDashboard />} />
        </Route>

        <Route path="/admin" element={<RouteGuard allowedRoles={[ROLES.ADMIN]}><DashboardLayout role="admin" /></RouteGuard>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>

        <Route path="/content" element={<RouteGuard allowedRoles={[ROLES.CONTENT]}><DashboardLayout role="content" /></RouteGuard>}>
          <Route index element={<Navigate to="/content/dashboard" replace />} />
          <Route path="dashboard" element={<ContentDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
