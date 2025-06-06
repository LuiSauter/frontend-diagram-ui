import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useHeader } from '@/hooks'
import { ArrowUpRight, ClockIcon, Plus, User, Users } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AddWorkspaceModal from './components/add-workspace-modal'
import { useGetAllResource } from '@/hooks/useApiResource'
import { calculateElapsedTime, ENDPOINTS, extractDateTime } from '@/utils'
import { useDispatch } from 'react-redux'
import { createWorkspace } from '@/redux/slices/workspace.slice'
import { type WorkspaceItem } from './models/workspace.model'
import MainPage from '@/layout/components/main-page'

const DashboardPage = (): React.ReactNode => {
  useHeader([
    { label: 'Dashboard' }
  ])
  const navigate = useNavigate()
  const [openModal, setOpenModal] = useState(false)
  const { allResource: workspaces, mutate } = useGetAllResource<WorkspaceItem>({ endpoint: ENDPOINTS.WORKSPACE, isPagination: false })
  const { allResource: workspacesInvitations } = useGetAllResource<any>({ endpoint: ENDPOINTS.WORKSPACE + '/invitation', isPagination: false })
  const dispatch = useDispatch()

  const handleSelectWorkspace = (workspace: WorkspaceItem) => {
    navigate(`/workspace/${workspace.id}`)
    dispatch(createWorkspace(workspace))
  }

  return (
    <MainPage>
      <div className="grid gap-4 overflow-hidden w-full relative">
        <div className="inline-flex justify-between items-center flex-wrap gap-2 w-full px-4">
          <h1 className='text-2xl font-bold text-light-text-primary dark:text-dark-text-primary'>
            Mis workspaces
          </h1>
          <AlertDialog open={openModal} onOpenChange={(open) => { setOpenModal(open) }}>
            <AlertDialogTrigger asChild>
              <Button type='button' size="sm" className="h-8 gap-1">
                <Plus className="h-3.5 w-3.5" />
                <span className='hidden sm:flex'>Nuevo workspace</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AddWorkspaceModal buttonText='Crear' title='Crear nuevo workspace' setOpenModal={setOpenModal} mutate={mutate} />
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 py-4'>
          {workspaces?.map((workspace: WorkspaceItem) => (
            <div key={workspace.id} className='flex flex-col gap-4 border border-light-border rounded-lg p-4 hover:shadow-lg bg-dark-bg-secondary hover:shadow-white/5'>
              <h2>{workspace.name}</h2>
              <span className='text-sm text-light-text-secondary dark:text-dark-text-secondary flex items-center gap-1'>
                <Users className='h-4 w-4 mr-1' />
                3
              </span>
              <span className='text-sm text-light-text-secondary dark:text-dark-text-secondary flex items-center gap-1'>
                <ClockIcon className='h-4 w-4 mr-1' />
                Creado {calculateElapsedTime(workspace?.createdAt)}
              </span>
              <Button variant='outline' size='sm' onClick={() => { handleSelectWorkspace(workspace) }} className='w-full'>
                Abrir <ArrowUpRight className='h-4 w-4 ml-2' />
              </Button>
            </div>
          ))}
        </div>
        <div className="inline-flex justify-between items-center flex-wrap gap-2 w-full px-4">
          <h2 className='text-xl font-semibold text-light-text-primary dark:text-dark-text-primary'>
            Proyectos compartidos
          </h2>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 py-4'>
          {workspacesInvitations?.length === 0 && <span className='text-sm text-light-text-secondary dark:text-dark-text-secondary flex items-center gap-1'>
            Aún no te han invitado a ningún proyecto
            </span>}
          {workspacesInvitations?.map((invitation: any) => (
            <div key={invitation.workspace.id} className='flex flex-col gap-4 border border-light-border rounded-lg p-4 hover:shadow-lg bg-dark-bg-secondary hover:shadow-white/5'>
              <h2>{invitation.workspace.name}</h2>
              <span className='text-sm text-light-text-secondary dark:text-dark-text-secondary flex items-center gap-1'>
                <User className='h-4 w-4 mr-1' />
                {invitation.workspace.owner.name}
              </span>
              <span className='text-sm text-light-text-secondary dark:text-dark-text-secondary flex items-center gap-1'>
                <Users className='h-4 w-4 mr-1' />
                {invitation.workspace.workspace_members.length ?? 0} miembros
              </span>
              <span className='text-sm text-light-text-secondary dark:text-dark-text-secondary flex items-center gap-1'>
                <ClockIcon className='h-4 w-4 mr-1' />
                Creado {calculateElapsedTime(invitation.workspace?.createdAt)}
              </span>
              <span className='text-sm text-light-text-secondary dark:text-dark-text-secondary flex items-center gap-1'>
                <ClockIcon className='h-4 w-4 mr-1' />
                Invitado {calculateElapsedTime(extractDateTime(String(invitation.invited_at)))}
              </span>
              <Button variant='outline' size='sm' onClick={() => { handleSelectWorkspace(invitation.workspace as WorkspaceItem) }} className='w-full'>
                Abrir <ArrowUpRight className='h-4 w-4 ml-2' />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </MainPage>
  )
}

export default DashboardPage
