import { v4 } from 'uuid'

import { Comment } from '../models'
import { type IComment } from '../types'

const createComment = async (comment: any): Promise<IComment> => {
  const newComment = new Comment({ ...comment, id: v4() })
  return await newComment.save()
}

const getComments = async (data: any): Promise<any> => {
  const { resourceId, timeCusor = new Date().getTime(), limitPerPage } = data
  const comments = await Comment.aggregate([
    {
      $match: {
        resourceId,
        parentId: {
          $exists: false
        },
        createdAt: {
          $lte: new Date(timeCusor)
        }
      }
    },
    { $sort: { createdAt: -1 } },
    { $limit: +limitPerPage + 1 },

    {
      $lookup: {
        from: 'comments',
        localField: 'id',
        foreignField: 'parentId',
        as: 'answers',
        pipeline: [
          {
            $sort: {
              createdAt: 1
            }
          }
        ]
      }
    }
  ])
  return comments
}

const getComment = async (id: string): Promise<IComment | null> => {
  const comment = await Comment.findOne({ id })
  return comment
}

const deleteComment = async (id: string): Promise<IComment | null> => {
  return await Comment.findOneAndDelete({ id })
}

const updateComment = async (
  id: string,
  sender: string,
  content: string
): Promise<IComment | null> => {
  return await Comment.findOneAndUpdate(
    { id, sender },
    { content },
    { returnDocument: 'after' }
  )
}

const deleteResourceComments = async (resourceId: string): Promise<any> => {
  await Comment.deleteMany({ resourceId })
}

const deleteChildComments = async (parentId: string): Promise<void> => {
  await Comment.deleteMany({ parentId })
}

export {
  createComment,
  getComments,
  deleteComment,
  getComment,
  updateComment,
  deleteResourceComments,
  deleteChildComments
}
