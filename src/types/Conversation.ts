export interface IConversation {
  id: string
  userId: string
  latestMsg: null | {
    sender: string
    content: string
  }
  isSeen: boolean[]
}
