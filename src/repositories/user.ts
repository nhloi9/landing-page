import { omitIsNil, removeVietnameseTones } from '../utils/index'
import { User } from '../models'
import { type IUser } from '../types'

const createUser = async (user: IUser): Promise<IUser> => {
  user.name_en = removeVietnameseTones(
    `${user.firstName} ${user.lastName} ${user.firstName}`
  )
  const newUser = new User(user)
  return await newUser.save()
}
const findUser = async (filters: any): Promise<IUser | null> => {
  return await User.findOne(omitIsNil(filters))
}
const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email })
}
const updateUser = async (data: any): Promise<any> => {
  const { userId, update } = data
  const updatedUser = await User.findOneAndUpdate({ id: userId }, update, {
    new: true
  })
  return updatedUser
}
const deleteUser = async (UserId: string): Promise<any> => {
  return await User.deleteOne({ id: UserId })
}
export { createUser, findUser, findUserByEmail, updateUser, deleteUser }
