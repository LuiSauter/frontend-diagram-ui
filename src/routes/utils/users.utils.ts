// import { createElement, lazy } from 'react'
// import { PrivateRoutes, type Route } from '@/models/routes.model'
// import { type PERMISSION } from '@/modules/auth/utils/permissions.constants'

import { type Route } from '@/models'

// const ProfilePage = lazy(() => import('@/modules/users/pages/profile'))
// const ProfileForm = lazy(() => import('@/modules/users/pages/profile/components/profile-form'))
// const UserPage = lazy(() => import('@modules/users/pages/users'))
// const UserFormPage = lazy(() => import('@modules/users/pages/users/components/user-form'))
// const RolesPage = lazy(() => import('@modules/auth/pages/roles'))
// const RolesFormPage = lazy(() => import('@modules/auth/pages/roles/components/role-form'))
// const PermissionsPage = lazy(() => import('@/modules/auth/pages/permissions'))
// const PermissionsFormPage = lazy(() => import('@/modules/auth/pages/permissions/components/permissions-form'))

export const userRoutes: Route[] = [
  // {
  //   path: PrivateRoutes.PROFILE,
  //   element: createElement(ProfilePage),
  //   permissions: [] as PERMISSION[]
  // },
  // {
  //   path: PrivateRoutes.PROFILE_UPDATE,
  //   element: createElement(ProfileForm, { buttonText: 'Actualizar', title: 'Actualizar su Cuenta' }),
  //   permissions: [] as PERMISSION[]
  // },
  // {
  //   path: PrivateRoutes.USER,
  //   element: createElement(UserPage),
  //   permissions: [] as PERMISSION[]
  // },
  // {
  //   path: PrivateRoutes.USER_CREAR,
  //   element: createElement(UserFormPage, { buttonText: 'Guardar Usuario', title: 'Crear Usuario' }),
  //   permissions: [] as PERMISSION[]
  // },
  // {
  //   path: PrivateRoutes.USER_EDIT,
  //   element: createElement(UserFormPage, { buttonText: 'Editar Usuario', title: 'Actualizar Usuario' }),
  //   permissions: [] as PERMISSION[]
  // },
  // {
  //   path: PrivateRoutes.ROLES,
  //   element: createElement(RolesPage),
  //   permissions: [] as PERMISSION[]
  // },
  // {
  //   path: PrivateRoutes.ROLE_FORM,
  //   element: createElement(RolesFormPage, { title: 'Crear Rol', buttonText: 'Guardar Rol' }),
  //   permissions: [] as PERMISSION[]
  // },
  // {
  //   path: PrivateRoutes.ROLE_EDIT,
  //   element: createElement(RolesFormPage, { title: 'Actualizar Rol', buttonText: 'Guardar Rol' }),
  //   permissions: [] as PERMISSION[]
  // },
  // {
  //   path: PrivateRoutes.PERMISSIONS,
  //   element: createElement(PermissionsPage),
  //   permissions: [] as PERMISSION[]
  // },
  // {
  //   path: PrivateRoutes.PERMISSIONS_CREATE,
  //   element: createElement(PermissionsFormPage, { title: 'Crear Permiso', buttonText: 'Guardar Permiso' }),
  //   permissions: [] as PERMISSION[]
  // },
  // {
  //   path: PrivateRoutes.PERMISSIONS_EDIT,
  //   element: createElement(PermissionsFormPage, { title: 'Actualizar Permiso', buttonText: 'Guardar Permiso' }),
  //   permissions: [] as PERMISSION[]
  // }
]
