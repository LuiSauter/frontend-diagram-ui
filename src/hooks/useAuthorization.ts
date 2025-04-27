import { type PERMISSION } from '@/modules/auth/utils/permissions.constants'
import { useAuth } from './useAuth'
import { authStatus } from '@/utils'

export const useAuthorization = () => {
  const { status } = useAuth()

  const verifyPermission = (permissionRequired: PERMISSION[]) => {
    if (status === authStatus.authenticated) {
      return permissionRequired.some(() =>
        // data?.role?.permissions?.some((rolePermission) =>
        //   rolePermission.permission.name === permission
        // )
        true
      )
    } else {
      return false
    }
  }

  return { verifyPermission }
}
