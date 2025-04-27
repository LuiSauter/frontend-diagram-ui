import { type ApiBase } from '@/models'

export interface SheetItem extends ApiBase {
  name: string
  versions: VersionItem[]
}

export interface VersionItem extends ApiBase {
  data: string
  version: string
}
