import { v4 } from 'uuid'

import { Resource } from '../models'
import { type IResource } from '../types'

const createResource = async (resource: IResource): Promise<IResource> => {
  const newResource = new Resource({ ...resource, id: v4() })
  await newResource.save()
  const { _id, ...resourceData } = newResource.toObject()
  return resourceData
}

const getResources = async (data: any): Promise<any> => {
  const { page = 1, keyword, category, limitPerPage } = data
  const match =
    keyword !== undefined && keyword !== null
      ? {
          category,
          $text: { $search: keyword }
        }
      : { category }
  const sort: any =
    keyword !== undefined && keyword !== null
      ? { score: { $meta: 'textScore' }, updatedAt: -1 }
      : { updatedAt: -1 }
  const [result] = await Resource.aggregate([
    { $match: match },
    {
      $project: {
        _id: 0
      }
    },
    {
      $facet: {
        resources: [
          { $sort: sort },
          { $skip: (page - 1) * limitPerPage },
          { $limit: limitPerPage }
        ],
        totalCount: [{ $count: 'count' }]
      }
    }
  ])
  const { resources, totalCount } = result
  return {
    resources,
    totalPages:
      totalCount[0] !== undefined
        ? Math.ceil(totalCount[0]?.count / limitPerPage)
        : 0
  }
}

const updateResource = async (data: any): Promise<any> => {
  const { resourceId, update } = data
  const newResource = await Resource.findOneAndUpdate(
    { id: resourceId },
    update,
    { new: true }
  )
  return newResource
}

const getResource = async (resourceId: string): Promise<IResource | null> => {
  const resourceData = await Resource.findOne({ id: resourceId })
  if (resourceData !== null) {
    const { _id, ...resource } = resourceData.toObject()
    return resource
  } else {
    return null
  }
}

const deleteResource = async (resourceId: string): Promise<any> => {
  return await Resource.deleteOne({ id: resourceId })
}

export {
  createResource,
  getResources,
  updateResource,
  getResource,
  deleteResource
}
