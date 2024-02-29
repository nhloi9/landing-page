import { type sortTypes } from '../constants'

export interface IQueryParams {
  sortType: sortTypes
  limit: number
  skip: number
}
