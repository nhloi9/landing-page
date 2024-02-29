export interface IComment {
  id: string
  sender: string
  receiver?: string
  content: string
  parentId?: string
  resourceId: string
}
