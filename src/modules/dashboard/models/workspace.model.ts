import { type ApiBase } from '@/models'
import { type ProjectItem } from './project.model'

export interface User extends ApiBase {
  avatar_url: string
  country_code: string
  email: string
  goole_id: string
  name: string
  phone: string
}

export interface WorkspaceItem extends ApiBase {
  name: string
  owner?: User
  projects: ProjectItem[] | null
}
