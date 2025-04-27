import { Outlet, useLocation } from 'react-router-dom'

import Header from './components/header'
import Aside from './components/aside'
import { useSidebar } from '@/context/sidebarContext'
import { Toaster } from '@/components/ui/sonner'
import { Suspense } from 'react'
import Loading from '@/components/shared/loading'

const Dashboard = () => {
  const { isContract } = useSidebar()
  const location = useLocation()
  return (
    <div
      className={`${isContract
        ? location.pathname === '/' ? 'md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1' : 'md:grid-cols-[84px_1fr] lg:grid-cols-[84px_1fr] xl:grid-cols-[84px_1fr]'
        : location.pathname === '/' ? 'md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1' : 'md:grid-cols-[286px_1fr] lg:grid-cols-[300px_1fr] xl:grid-cols-[320px_1fr]'} flex flex-col min-h-[100dvh] w-full bg-light-bg-primary dark:bg-dark-bg-primary overflow-hidden relative md:grid md:grid-cols-1
        `}
    >
      {location.pathname !== '/' && <Aside />}
      <div className='max-h-[100dvh] overflow-hidden w-full flex flex-col'>
        <Header />
        <div className='flex flex-row w-full h-[calc(100dvh-56px)] lg:h-[calc(100dvh-60px)] relative overflow-hidden bg-light-bg-secondary dark:bg-dark-bg-primary'>
          {/* <Aside /> */}
          {/* <MainPage> */}
          <Suspense
            fallback={
              <div className='grid place-content-center place-items-center min-h-[calc(100dvh-55px-54px)] lg:min-h-[calc(100dvh-63px-54px)] text-action text-light-action dark:text-dark-action'>
                <Loading />
              </div>
            }
          >
            <Outlet />
          </Suspense>
          {/* </MainPage> */}
          <Toaster richColors />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
