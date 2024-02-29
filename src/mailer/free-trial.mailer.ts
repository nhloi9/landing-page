import mjml2html from 'mjml'

import { transporter } from '../configs/index'
import path from 'path'

const sendFreeTrialEmail = async (body: any): Promise<void> => {
  const mjmlTemplate = `
  <mjml>
  <mj-body>
    <mj-container>
      <mj-section>
        <mj-column>
        <mj-image src="cid:logo" alt="Logo" width="150px" padding="0 15px 15px 0"></mj-image>
          <mj-text font-size="20px" color="#000000" font-family="Arial, sans-serif">Dear SEO team,</mj-text>
          <mj-text font-size="16px" color="#000000" font-family="Arial, sans-serif">Here are the details of a new customer:</mj-text>
          <mj-table>
            <tr style="border-bottom:1px solid #ecedee;text-align:left;">
              <th style="padding:10px 0;">First Name</th>
              <th style="padding:10px 0;">Last Name</th>
              <th style="padding:10px 0;">Email</th>
              <th style="padding:10px 0;">Phone</th>
              <th style="padding:10px 0;">Country</th>
              <th style="padding:10px 0;">Project Description</th>
            </tr>
            <tr>
              <td style="padding:10px 0;">${body.firstName as string}</td>
              <td style="padding:10px 0;">${body.lastName as string}</td>
              <td style="padding:10px 0;">${body.email as string}</td>
              <td style="padding:10px 0;">${body.phone as string}</td>
              <td style="padding:10px 0;">${body.country as string}</td>
              <td style="padding:10px 0;">${
                body.projectDescription as string
              }</td>
            </tr>
          </mj-table>
        </mj-column>
      </mj-section>
    </mj-container>
  </mj-body>
</mjml>

  `
  const { html } = mjml2html(mjmlTemplate)
  // Gửi email
  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: process.env.MAIL_SEO,
    subject: 'Khách hàng mới',
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

export { sendFreeTrialEmail }
