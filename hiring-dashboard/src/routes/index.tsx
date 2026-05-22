import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { AppLayout, AuthLayout } from '@/layouts'
import {
  ActivityLogPage,
  CandidateDetailPage,
  CandidatesPage,
  DashboardPage,
  FeedbackPage,
  InterviewsPage,
  JobDetailPage,
  JobsPage,
  KanbanPage,
  LoginPage,
  ReportsPage,
  SettingsPage,
} from '@/pages'
import { ProtectedRoute } from './ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
          { path: ROUTES.JOBS, element: <JobsPage /> },
          { path: ROUTES.JOB_DETAIL, element: <JobDetailPage /> },
          { path: ROUTES.CANDIDATES, element: <CandidatesPage /> },
          { path: ROUTES.CANDIDATE_DETAIL, element: <CandidateDetailPage /> },
          { path: ROUTES.KANBAN, element: <KanbanPage /> },
          { path: ROUTES.INTERVIEWS, element: <InterviewsPage /> },
          { path: ROUTES.FEEDBACK, element: <FeedbackPage /> },
          { path: ROUTES.REPORTS, element: <ReportsPage /> },
          { path: ROUTES.ACTIVITY_LOG, element: <ActivityLogPage /> },
          { path: ROUTES.SETTINGS, element: <SettingsPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
])
