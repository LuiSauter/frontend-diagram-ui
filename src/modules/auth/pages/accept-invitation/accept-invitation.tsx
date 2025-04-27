import { Toaster } from '@/components/ui/sonner'
import { useCreateResource } from '@/hooks/useApiResource'
import MainPage from '@/layout/components/main-page'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

const AccepInvitationPage = () => {
  const [searchParam] = useSearchParams()
  const navigate = useNavigate()
  const { createResource: acceptInvitation } = useCreateResource({ endpoint: '/api/workspace/confirm-invitation' })
  let subscribe = true
  useEffect(() => {
    if (subscribe) {
      if (searchParam.get('token')) {
        setTimeout(() => {
          toast.promise(
            acceptInvitation({ token: searchParam.get('token') }),
            {
              loading: 'Cargando...',
              success: () => {
                setTimeout(() => {
                  navigate('/')
                }, 1000)
                return 'Invitación aceptada'
              },
              error: () => {
                return 'Error al aceptar la invitación.'
              }
            }
          )
        }, 1000)
      }
    }
    return () => {
      subscribe = false
    }
  }, [searchParam.get('token')])

  return (
    <MainPage>
      <Toaster />
      <section className='grid place-content-center place-items-center gap-4 h-full min-h-[calc(100dvh-150px)] p-4'>
        <h1 className='text-2xl text-light-text-primary dark:text-dark-text-primary font-semibold'>
          Aceptando invitación
        </h1>
        <h2 className='text-base w-full text-light-text-secondary dark:text-dark-text-secondary flex items-center gap-1'>
          Espere un momento mientras se procesa su invitación.
        </h2>
      </section>
    </MainPage>
  )
}

export default AccepInvitationPage
