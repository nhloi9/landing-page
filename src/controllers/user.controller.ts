import { type Request, type Response, type NextFunction } from 'express'
import httpStatus from 'http-status'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { v4 } from 'uuid'

import { conversationRepo, userRepo } from '../repositories'
import { getApiResponse, createToken } from '../utils'
import { User } from '../models'
import { mailer } from '../mailer'
import { messages } from '../constants'
import { accessTokenSettings } from '../configs'
import { type IConversation, type RequestPayload } from '../types'

// Đăng nhập
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body

    // Tìm user trong database
    const user = await userRepo.findUser({ email })
    // Nếu không tìm thấy user, trả về lỗi
    if (user == null) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json(getApiResponse(messages.USER_NOT_EXISTED))
    } else if (!user.isActivated) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(getApiResponse(messages.USER_NOT_ACTIVATED))
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password)

    // Nếu mật khẩu không đúng, trả về lỗi
    if (!isMatch) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(getApiResponse(messages.USER_PASSWORD_NOT_MATCHED))
    }

    // Tạo token
    const token = createToken(
      { id: user.id, role: user.role },
      accessTokenSettings.accessTokenExp
    )

    // Trả về thông tin user và token
    res.status(httpStatus.OK).json(
      getApiResponse({
        data: {
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          },
          token
        }
      })
    )
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(getApiResponse(messages.USER_TOKEN_INVALID))
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(getApiResponse(messages.ACCESS_TOKEN_EXPIRED))
    }
    next(error)
  }
}

// Đăng ký user mới
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body

    // Kiểm tra xem email đã được đăng ký trước đó chưa
    const existingUser = await userRepo.findUser({ email })
    if (existingUser != null) {
      return res
        .status(httpStatus.CONFLICT)
        .json(getApiResponse(messages.USER_EMAIL_ALREADY_EXISTED))
    }

    // Lưu User vào database
    const newUser = await userRepo.createUser({ id: v4(), ...req.body })

    // create conversation for new user
    const newConvo = {
      userId: newUser.id,
      latestMsg: null
    }
    await conversationRepo.createConversation(newConvo as IConversation)

    // Tạo Token
    const activateToken = createToken(
      { id: newUser.id, role: newUser.role },
      accessTokenSettings.activateTokenExp
    )

    // Gửi mail
    void mailer.sendActivateMail({
      email,
      lastName: req.body.lastName,
      activateToken
    })
    return res
      .status(httpStatus.OK)
      .json(getApiResponse(messages.USER_SENT_REQUEST_TO_MAIL))
  } catch (error) {
    next(error)
  }
}

// Xác thực email để kích hoạt tài khoản
export const activeAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { activateToken } = req.params
  try {
    // Giải mã token để tìm người dùng
    const userData: any = jwt.verify(activateToken, accessTokenSettings.secret)
    const exitedUser = await userRepo.findUser({ id: userData.id })
    if (exitedUser === null) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json(getApiResponse(messages.USER_NOT_EXISTED))
    }
    if (exitedUser !== null && !exitedUser.isActivated) {
      await User.findOneAndUpdate(
        { email: exitedUser.email },
        { isActivated: true }
      )
      return res.status(httpStatus.OK).json(
        getApiResponse({
          msg: messages.USER_ACTIVATE,
          data: {
            email: exitedUser.email,
            firstName: exitedUser.firstName,
            lastName: exitedUser.lastName
          }
        })
      )
    } else {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(getApiResponse(messages.USER_ACTIVATED))
    }
  } catch (error) {
    next(error)
  }
}

// Hàm quên mật khẩu
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body

  try {
    // Tìm người dùng theo email
    const user = await userRepo.findUser({ email })
    if (user == null) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json(getApiResponse(messages.USER_EMAIL_NOT_EXISTED))
    } else if (!user.isActivated) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(getApiResponse(messages.USER_NOT_ACTIVATED))
    }
    // Tạo token
    const resetPasswordToken = createToken(
      { id: user.id },
      accessTokenSettings.forgotPwdExp
    )

    // Gửi email đặt lại mật khẩu
    void mailer.sendForgotPasswordEmail({
      email: user.email,
      lastName: user.lastName,
      resetPasswordToken
    })
    return res.status(httpStatus.OK).json(
      getApiResponse({
        msg: messages.USER_SENT_REQUEST_TO_MAIL,
        data: { email }
      })
    )
  } catch (error) {
    next(error)
  }
}

// Hàm đặt lại mật khẩu
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password } = req.body

  try {
    const { resetPasswordToken } = req.params
    // Giải mã token để tìm người dùng
    const decodedToken: any = jwt.verify(
      resetPasswordToken,
      accessTokenSettings.secret
    )
    const user = await User.findOne({ id: decodedToken.id })

    // Kiểm tra xem mã thông báo có hợp lệ hay không
    if (user == null) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(getApiResponse(messages.USER_NOT_EXISTED))
    }

    // Mã hóa mật khẩu mới và cập nhật vào cơ sở dữ liệu
    user.password = password
    await user.save()
    return res
      .status(httpStatus.OK)
      .json(getApiResponse(messages.USER_RESET_PASSWORD))
  } catch (error) {
    next(error)
  }
}
// Hàm đổi mật khẩu
export const changePassword = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.payload?.id
    // Giải mã token để tìm người dùng
    const changePasswordUser = await User.findOne({ id })
    console.log(changePasswordUser)
    const { currentPassword, newPassword, confirmNewPassword } = req.body
    // Kiểm tra xem mật khẩu hiện tại có khớp với mật khẩu trong cơ sở dữ liệu hay không
    if (changePasswordUser == null) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(getApiResponse(messages.USER_NOT_EXISTED))
    }
    const isMatch = await bcrypt.compare(
      currentPassword,
      changePasswordUser.password
    )
    if (!isMatch) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(getApiResponse(messages.USER_PASSWORD_INVALID))
    }
    if (currentPassword === newPassword) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(getApiResponse(messages.USER_PASSWORD_NOT_CHANGED))
    }
    // Kiểm tra xem mật khẩu mới và mật khẩu xác nhận có khớp nhau hay không
    if (newPassword !== confirmNewPassword) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(getApiResponse(messages.USER_PASSWORD_NOT_MATCHED))
    }

    changePasswordUser.password = newPassword
    await changePasswordUser.save()
    return res
      .status(httpStatus.OK)
      .json(getApiResponse(messages.USER_CHANGE_PASSWORD))
  } catch (error) {
    next(error)
  }
}
export const getUser = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.payload?.id
    const user = await User.findOne({ id })
    if (user == null) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json(getApiResponse(messages.USER_NOT_EXISTED))
    }
    return res.status(httpStatus.OK).json(
      getApiResponse({
        msg: messages.USER_ACTIVATED,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      })
    )
  } catch (error) {
    next(error)
  }
}

///
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body

    // Kiểm tra xem email đã được đăng ký trước đó chưa
    const existingUser = await userRepo.findUser({ email })
    if (existingUser != null) {
      return res
        .status(httpStatus.CONFLICT)
        .json(getApiResponse(messages.USER_EMAIL_ALREADY_EXISTED))
    }

    // Lưu User vào database
    const newUser = await userRepo.createUser({
      id: v4(),
      ...req.body,
      isActivated: true
    })
    void mailer.sendCreateUserEmail({
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      role: req.body.role
    })

    return res.status(httpStatus.OK).json(getApiResponse({ data: newUser }))
  } catch (error) {
    next(error)
  }
}
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params
    const updatedUser = await userRepo.updateUser({ userId, update: req.body })
    if (updatedUser == null) {
      res
        .status(httpStatus.NOT_FOUND)
        .json(getApiResponse(messages.USER_NOT_FOUND))
    } else {
      res.status(httpStatus.OK).json(getApiResponse({ data: updatedUser }))
    }
  } catch (error) {
    next(error)
  }
}
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find()
    return res.status(httpStatus.OK).json(getApiResponse({ data: users }))
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { deletedCount } = await userRepo.deleteUser(req.params.userId)
    if (deletedCount === 1) {
      return res
        .status(httpStatus.OK)
        .json(getApiResponse(messages.USER_DELETED_SUCCESS))
    } else {
      return res
        .status(httpStatus.NOT_FOUND)
        .json(getApiResponse(messages.USER_NOT_FOUND))
    }
  } catch (error) {
    next(error)
  }
}
