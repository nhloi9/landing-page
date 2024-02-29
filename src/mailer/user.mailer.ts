import mjml2html from 'mjml'

import { transporter } from '../configs/index'
import path from 'path'

const sendActivateMail = async (data: any): Promise<void> => {
  const mjmlTemplate = `
  <mjml>
  <mj-head>
    <mj-title>Activate Your Account</mj-title>
    <mj-attributes>
      <mj-all font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"></mj-all>
      <mj-text font-size="16px" color="#444444" line-height="1.5"></mj-text>
    </mj-attributes>
  </mj-head>
  <mj-body background-color="#f3f3f3">
    <mj-section>
      <mj-column>
        <mj-image src="cid:logo" alt="Logo" width="100px" padding-bottom="20px"></mj-image>
        <mj-text align="center" font-size="24px" color="#007bff" font-weight="bold" padding-bottom="20px">Activate Your Account</mj-text>
        <mj-divider border-color="#007bff" padding-bottom="20px"></mj-divider>
        <mj-text font-size="18px" color="#444444" padding-bottom="20px">Dear ${
          data.lastName as string
        },</mj-text>
        <mj-text font-size="16px" color="#444444" line-height="1.5">Thank you for signing up for our service! Please click the following link to activate your account:</mj-text>
        <mj-button href="${process.env.CLIENT_URL as string}/verify-email/${
    data.activateToken as string
  }" background-color="#007bff" color="#ffffff" font-size="18px" padding-top="20px" padding-bottom="20px">Activate Account</mj-button>
        <mj-text font-size="14px" color="#444444" padding-top="20px">If you did not sign up for our service, please disregard this email.</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`
  const { html } = mjml2html(mjmlTemplate)
  // Tạo nội dung email
  const mailOptions = {
    from: process.env.MAIL_USERNAME, // Địa chỉ email của bạn
    to: data.email, // Địa chỉ email của người dùng
    subject: 'Xác thực tài khoản',
    html,
    attachments: [
      {
        filename: 'logo.png',
        path: path.join(__dirname, '.', 'images', 'logo.png'),
        cid: 'logo'
      }
    ]
  }
  await transporter.sendMail(mailOptions)
}

//
const sendForgotPasswordEmail = async (data: any): Promise<void> => {
  const mjmlTemplate = `
  <mjml>
  <mj-head>
    <mj-attributes>
      <mj-text font-size="16px" color="#000000" line-height="24px" font-family="Helvetica"></mj-text>
      <mj-button font-size="16px" background-color="#007bff" color="#ffffff" font-weight="bold" border-radius="4px" padding="10px 16px"></mj-button>
    </mj-attributes>
    <mj-styles>
      .button {
        text-align: center;
      }
    </mj-styles>
  </mj-head>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-image src="cid:logo" alt="Logo" width="150px" padding="0 15px 15px 0"></mj-image>
        <mj-text font-size="24px" color="#000000" font-weight="bold" line-height="30px" padding="0 0 15px 0">Reset Password</mj-text>
        <mj-text font-size="16px" color="#000000" line-height="24px" padding="0 0 15px 0">Hello ${
          data.lastName as string
        },</mj-text>
        <mj-text font-size="16px" color="#000000" line-height="24px" padding="0 0 15px 0">You are receiving this email because we received a request to reset your password for your account.</mj-text>
        <mj-text font-size="16px" color="#000000" line-height="24px" padding="0 0 15px 0">Click the button below to reset your password:</mj-text>
        <mj-button href="${process.env.CLIENT_URL as string}/reset-password/${
    data.resetPasswordToken as string
  }">Reset Password</mj-button>
        <mj-text font-size="16px" color="#000000" line-height="24px" padding="15px 0 0 0">This link will expire in 1 hour.</mj-text>
        <mj-text font-size="16px" color="#000000" line-height="24px" padding="15px 0 0 0">If you did not request a password reset, no further action is required.</mj-text>
        <mj-divider border-color="#e5e5e5" padding="15px 0"></mj-divider>
        <mj-text font-size="14px" color="#000000" line-height="20px" padding="15px 0 0 0">If you’re having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:</mj-text>
        <mj-text font-size="14px" color="#000000" line-height="20px" padding="0 0 15px 0">{{ resetUrl }}</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
  `
  const { html } = mjml2html(mjmlTemplate)
  // Gửi email
  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: data.email,
    subject: 'Yêu cầu đặt lại mật khẩu',
    html,
    attachments: [
      {
        filename: 'logo.png',
        path: path.join(__dirname, '.', 'images', 'logo.png'),
        cid: 'logo'
      }
    ]
  }
  await transporter.sendMail(mailOptions)
}

const sendCreateUserEmail = async (data: any): Promise<void> => {
  const mjmlTemplate = `
  <mjml>
  <mj-body>
    <mj-container>
      <mj-section>
        <mj-column>
        <mj-image src="cid:logo" alt="Logo" width="150px" padding="0 15px 15px 0"></mj-image>
          <mj-text font-size="20px" color="#000000" font-family="Arial, sans-serif">Dear ${
            data.lastName as string
          },</mj-text>
          <mj-text font-size="16px" color="#000000" font-family="Arial, sans-serif">Bạn đã tạo tài khoản thành công.</mj-text>
          <mj-text font-size="16px" color="#000000" font-family="Arial, sans-serif">Dưới đây là thông tin tài khoản của bạn:</mj-text>
          <mj-table>
            <tr style="border-bottom:1px solid #ecedee;text-align:left;">
              <th style="padding:10px 0;">Tên người dùng</th>
              <th style="padding:10px 0;">Email</th>
              <th style="padding:10px 0;">password</th>
              <th style="padding:10px 0;">Vai trò</th>
            </tr>
            <tr>
              <td style="padding:10px 0;">${data.lastName as string}</td>
              <td style="padding:10px 0;">${data.email as string}</td>
              <td style="padding:10px 0;">${data.password as string}</td>
              <td style="padding:10px 0;">${data.role as string}</td>
            </tr>
          </mj-table>
        </mj-column>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>`
  const { html } = mjml2html(mjmlTemplate)
  // Tạo nội dung email
  const mailOptions = {
    from: process.env.MAIL_USERNAME, // Địa chỉ email của bạn
    to: data.email, // Địa chỉ email của người dùng
    subject: 'Xác thực tài khoản',
    html,
    attachments: [
      {
        filename: 'logo.png',
        path: path.join(__dirname, '.', 'images', 'logo.png'),
        cid: 'logo'
      }
    ]
  }
  await transporter.sendMail(mailOptions)
}
export { sendActivateMail, sendForgotPasswordEmail, sendCreateUserEmail }
