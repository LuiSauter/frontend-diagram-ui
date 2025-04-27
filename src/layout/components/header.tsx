import { ChevronDown, Download, LogOut, Menu, MoreVertical, Play, Share2 } from 'lucide-react'
import { useLocation, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Navigation from './navigation'
import { useAuth } from '@/hooks'
import { AppConfig } from '@/config'
import { useSelector } from 'react-redux'
import { type RootState } from '@/redux/store'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useCreateResource, useGetResource } from '@/hooks/useApiResource'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

const Header = () => {
  const { signOut } = useAuth()
  const location = useLocation()
  const { workspace } = useSelector((state: RootState) => state.workspace)
  const user = useSelector((state: RootState) => state.user)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('edit')
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const params = useParams()

  const { resource: members, mutate } = useGetResource<any>({ endpoint: `/api/workspace/${params.id}` })
  const { createResource: inviteMember, isMutating } = useCreateResource({ endpoint: `/api/workspace/${params.id}/invite` })

  const handleShare = () => {
    // Aquí puedes manejar la lógica para compartir el workspace
    if (email === '') {
      toast.error('Por favor, ingresa un correo electrónico')
      return
    }
    console.log(`Invitando a ${email} como ${role}`)
    toast.promise(
      inviteMember({ email, role }),
      {
        loading: 'Invitando...',
        success: (data) => {
          console.log('Invitación enviada:', data)
          toast.success('Invitación enviada')
          void mutate()
          return 'Invitación enviada'
        },
        error: (error) => {
          return error.response?.data?.message || 'Error al invitar'
        }
      }
    )

    setEmail('')
    setRole('edit')
    setIsShareDialogOpen(false)
  }
  const handleShareDialogOpen = () => {
    setIsShareDialogOpen(true)
  }

  return (
    <header className="flex h-14 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6 dark:bg-dark-bg-secondary bg-light-bg-primary">
      {location.pathname === '/' && <div className="flex items-center gap-3 px-4 border-b py-3 h-14">
        <h1>
          {workspace.name ? workspace.name : AppConfig.APP_TITLE}
        </h1>
      </div>}
      {location.pathname !== '/' && <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col px-0 py-0 gap-0">
          <SheetHeader>
            <div className="flex items-center gap-3 px-4 border-b py-3 h-14">
              <h1>
                {workspace.name ? workspace.name : AppConfig.APP_TITLE}
              </h1>
            </div>
          </SheetHeader>
          <Navigation />
        </SheetContent>
      </Sheet>}
      {/* <div className="w-full flex-1">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumb.map((item, index) => (
              item.path
                ? (<div className='flex items-center sm:gap-2' key={index}>
                  <BreadcrumbItem>

                    <Link to={item.path}>{item.label}</Link>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </div>)
                : <BreadcrumbItem key={index}><BreadcrumbPage>{item.label}</BreadcrumbPage></BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div> */}
      {/* <Notificaciones></Notificaciones> */}
      <div className='ml-auto flex items-center gap-4'>
        {location.pathname.includes('/workspace') && (
          <>
            <Button size='sm' variant='secondary' onClick={handleShareDialogOpen}>
              <Share2 className="sm:mr-2 h-4 w-4" />
              <span className='hidden sm:flex'>Compartir</span>
            </Button>
            <Button size='sm' variant='secondary'>
              <Play className="sm:mr-2 h-4 w-4" />
              <span className='hidden sm:flex'>Vista previa</span>
            </Button>
            <Button size='sm' variant='default'>
              <Download className="sm:mr-2 h-4 w-4" />
              <span className='hidden sm:flex'>Exportar</span>
            </Button>
          </>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <img
                src={user?.avatar_url}
                alt={user?.name}
                className="h-8 w-8 rounded-full"
              />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
            <DropdownMenuLabel className='text-light-text-secondary dark:text-light-text-secondary'>{user.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem onClick={() => { navigate(PrivateRoutes.PROFILE) }} className='cursor-pointer'>
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { navigate(PrivateRoutes.SETTINGS) }} className='cursor-pointer'>
              <Settings className="mr-2 h-4 w-4" />
              Configuración
            </DropdownMenuItem>
            <DropdownMenuSeparator /> */}
            <DropdownMenuItem onClick={signOut} className='cursor-pointer'>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Compartir workspace</DialogTitle>
            <DialogDescription>
              Invita a colaboradores a trabajar en este proyecto
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center space-x-2 my-4">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="email" className="sr-only">
                Email
              </Label>
              <Input

                id="email"
                placeholder="Correo electrónico"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value) }}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-24 justify-between">
                  {role === 'edit' ? 'Editor' : role === 'view' ? 'Lector' : 'Lector'}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => { setRole('edit') }}>
                  Editor
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setRole('view') }}>
                  Lector
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={handleShare} type="submit" disabled={isMutating}>
              Invitar
            </Button>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-3">Colaboradores</h4>
            <div className="space-y-3">
              {members?.workspace_members && members?.workspace_members.length === 0 && (
                <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  No hay colaboradores.
                </div>
              )}
              {members?.workspace_members?.map((member: any) => (
                <CollaboratorItem
                  key={member.id}
                  name={member.user.name}
                  email={member.user.email}
                  role={member.user.role}
                  avatarUrl={member.user.avatar_url ? member.user.avatar_url : 'https://ui-avatars.com/api/?name=CN&background=random&color=fff&bold=true'}
                  status={member.status}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}

export default Header

interface CollaboratorItemProps {
  name: string
  email: string
  role: string
  avatarUrl: string
  status: 'pending' | 'accepted' | 'rejected'
}

function CollaboratorItem({ name, email, role, avatarUrl, status }: CollaboratorItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="text-sm font-medium">{name}</div>
          <div className="text-xs text-muted-foreground">{email}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge
          variant={status === 'pending' ? 'secondary' : status === 'accepted' ? 'default' : 'destructive'}
          className="text-xs"
        >
          {status === 'pending' ? 'Pendiente' : status === 'accepted' ? 'Aceptado' : 'Rechazado'}
        </Badge>
        <span className="text-xs text-muted-foreground">{role}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => { /* Aquí puedes manejar la lógica para editar el colaborador */ }}
            >Cambiar a Editor</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => { /* Aquí puedes manejar la lógica para cambiar a lector */ }}
            >Cambiar a Lector</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
