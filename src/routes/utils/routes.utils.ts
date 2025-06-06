import { createElement, lazy } from 'react'
import { userRoutes } from '.'
import { PrivateRoutes, type Route } from '@/models/routes.model'
import { type PERMISSION } from '@/modules/auth/utils/permissions.constants'

const DashboardPage = lazy(() => import('@modules/dashboard'))
// const SettingPage = lazy(() => import('@modules/settings/pages/setting'))
const NotFound = lazy(() => import('@/components/not-found'))
const WorkspacePage = lazy(() => import('@modules/dashboard/pages/workspace'))
const SheetPage = lazy(() => import('@modules/dashboard/pages/sheet-page'))

export const PrivateAllRoutes: Route[] = [
  {
    path: '/*',
    element: createElement(NotFound),
    permissions: [] as PERMISSION[]
  },
  {
    path: PrivateRoutes.DASHBOARD,
    element: createElement(DashboardPage),
    permissions: [] as PERMISSION[]
  },
  {
    path: PrivateRoutes.WORKSPACE,
    element: createElement(WorkspacePage),
    permissions: [] as PERMISSION[]
  },
  {
    path: PrivateRoutes.WORKSPACE_SHEET,
    element: createElement(SheetPage),
    permissions: [] as PERMISSION[]
  },
  // {
  //   path: PrivateRoutes.SETTINGS,
  //   element: createElement(SettingPage),
  //   permissions: [] as PERMISSION[]
  // },
  ...userRoutes
]
