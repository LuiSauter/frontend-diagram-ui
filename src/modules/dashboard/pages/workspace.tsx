import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useSelector } from 'react-redux'
import { type RootState } from '@/redux/store'
import { File, Plus } from 'lucide-react'
import MainPage from '@/layout/components/main-page'

const WorkspacePage = () => {
  const params = useParams()
  const { workspace } = useSelector((state: RootState) => state.workspace)
  console.log(params.id)
  return (
    <MainPage>
      <Helmet>
        <title>
          {workspace.name ? workspace.name : 'My workspace'} | Workspace
        </title>
        <meta name="description" content={`${workspace.name ? workspace.name : 'My workspace'}`} />
        <link rel="canonical" href={`/workspace/${workspace.id}`} />
      </Helmet>
      <section className='grid place-content-center place-items-center gap-4 h-full min-h-[calc(100dvh-150px)] p-4'>
        <h1 className='text-2xl text-light-text-primary dark:text-dark-text-primary font-semibold'>
          {workspace.name ? workspace.name : 'My workspace'}
        </h1>
        <h2 className='text-base w-full text-light-text-secondary dark:text-dark-text-secondary flex items-center gap-1'>
          <File className='h-5 w-5 inline-block mr-2' />
          Selecciona una hoja de trabajo
        </h2>
        <p className='text-base w-full text-light-text-secondary dark:text-dark-text-secondary flex items-center gap-1'>
          <Plus className='h-5 w-5 inline-block mr-2' />
          Crea una hoja de trabajo
        </p>
      </section>
    </MainPage>
  )
}

export default WorkspacePage
