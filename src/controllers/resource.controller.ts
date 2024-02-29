import { type Request, type Response, type NextFunction } from 'express'
import httpStatus from 'http-status'

import { commentRepo, resourceRepo } from '../repositories'
import { getApiResponse } from '../utils'
import { messages } from '../constants'

export const createResource = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const createdResource = await resourceRepo.createResource(req.body)
    res
      .status(httpStatus.CREATED)
      .json(getApiResponse({ data: createdResource }))
  } catch (error) {
    next(error)
  }
}

export const getResources = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resources = await resourceRepo.getResources(req.query)
    return res.status(httpStatus.OK).json(getApiResponse({ data: resources }))
  } catch (error) {
    next(error)
  }
}

export const updateResource = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { resourceId } = req.params
    const updatedResource = await resourceRepo.updateResource({
      resourceId,
      update: req.body
    })
    if (updatedResource == null) {
      res
        .status(httpStatus.NOT_FOUND)
        .json(getApiResponse(messages.RESOURCE_NOT_FOUND))
    } else {
      res.status(httpStatus.OK).json(getApiResponse({ data: updatedResource }))
    }
  } catch (error) {
    next(error)
  }
}

export const getResource = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resource = await resourceRepo.getResource(req.params.resourceId)
    if (resource !== null) {
      return res.status(httpStatus.OK).json(getApiResponse({ data: resource }))
    } else {
      return res
        .status(httpStatus.NOT_FOUND)
        .json(getApiResponse(messages.RESOURCE_NOT_FOUND))
    }
  } catch (error) {
    next(error)
  }
}

export const deleteResource = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resourceId = req.params.resourceId
    const existResource = await resourceRepo.getResource(resourceId)
    if (existResource == null) {
      res
        .status(httpStatus.NOT_FOUND)
        .json(getApiResponse(messages.RESOURCE_NOT_FOUND))
    } else {
      await Promise.all([
        resourceRepo.deleteResource(resourceId),
        commentRepo.deleteResourceComments(resourceId)
      ])
      res
        .status(httpStatus.OK)
        .json(getApiResponse(messages.RESOURCE_DElETED_SUCCESS))
    }
  } catch (error) {
    next(error)
  }
}
