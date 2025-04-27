import { type ApiBase } from '@/models'
import { type SheetItem } from './sheets.model'

export interface ProjectItem extends ApiBase {
  name: string
  sheets: SheetItem[]
}
