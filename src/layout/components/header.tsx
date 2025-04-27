import { Download, LogOut, Menu, Play, Share2 } from 'lucide-react'
import { useLocation } from 'react-router-dom'

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

const Header = () => {
  const { signOut } = useAuth()
  const location = useLocation()
  const { workspace } = useSelector((state: RootState) => state.workspace)
  const user = useSelector((state: RootState) => state.user)

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
            <Button size='sm' variant='secondary'>
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
              <Avatar>
                <AvatarImage
                  src={user?.avatar_url ? user?.avatar_url : 'https://ui-avatars.com/api/?name=CN&background=random&color=fff&bold=true'}
                  alt={user?.name ? user?.name : 'CN'}
                />
                <AvatarFallback>
                  {user?.name ? user?.name.charAt(0).toUpperCase() : 'Bo'}
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
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
    </header>
  )
}

export default Header
