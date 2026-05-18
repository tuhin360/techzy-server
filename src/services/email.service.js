const nodemailer = require("nodemailer");

// Create transport with fallback for local sandboxing (using Ethereal/nodemailer test account)
const getTransporter = async () => {
  // If env variables are provided, use them (production-ready SMTP setup)
  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  ) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback: Create dynamic Nodemailer developer test account (Ethereal)
  // This ensures that the code runs perfectly out-of-the-box for the user,
  // without needing any pre-configured environmental SMTP keys, and outputs a URL to inspect the sent email!
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

const sendPaymentReceiptEmail = async ({
  email,
  transactionId,
  amount,
  date,
  products = [],
}) => {
  try {
    const transporter = await getTransporter();

    // Format products list into a beautiful clean HTML table
    let productsListHtml = "";
    if (products.length > 0) {
      productsListHtml = products
        .map(
          (product) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #edf2f7; text-align: left;">
            <div style="font-weight: 600; color: #2d3748; font-size: 14px;">${product.name || product.title}</div>
            <div style="color: #718096; font-size: 12px; margin-top: 2px;">Category: ${product.category || "General"}</div>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #edf2f7; text-align: right; color: #2d3748; font-weight: 600; font-size: 14px;">
            $${product.price ? Number(product.price).toFixed(2) : "0.00"}
          </td>
        </tr>
      `
        )
        .join("");
    } else {
      productsListHtml = `
        <tr>
          <td colspan="2" style="padding: 20px; text-align: center; color: #a0aec0; font-style: italic;">
            Techzy Products Order
          </td>
        </tr>
      `;
    }

    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - TechZy</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f7fafc;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.04);
            border: 1px solid #edf2f7;
          }
          .header {
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
            padding: 40px 20px;
            text-align: center;
            color: #ffffff;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -0.5px;
          }
          .header p {
            margin: 8px 0 0 0;
            font-size: 15px;
            opacity: 0.9;
          }
          .content {
            padding: 40px 30px;
          }
          .order-details {
            background-color: #f8fafc;
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 30px;
            border: 1px solid #f1f5f9;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 14px;
          }
          .detail-row:last-child {
            margin-bottom: 0;
          }
          .detail-label {
            color: #718096;
            font-weight: 500;
          }
          .detail-value {
            color: #2d3748;
            font-weight: 600;
            font-family: monospace;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          .total-row {
            font-size: 16px;
            font-weight: 700;
            color: #ea580c;
          }
          .btn-container {
            text-align: center;
            margin-top: 30px;
          }
          .btn {
            display: inline-block;
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 30px;
            border-radius: 12px;
            font-weight: 750;
            font-size: 15px;
            box-shadow: 0 4px 15px rgba(234, 88, 12, 0.25);
            transition: all 0.3s ease;
          }
          .footer {
            background-color: #f7fafc;
            padding: 24px;
            text-align: center;
            border-top: 1px solid #edf2f7;
            font-size: 12px;
            color: #a0aec0;
          }
          .footer a {
            color: #ea580c;
            text-decoration: none;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Thank You for Your Order!</h1>
            <p>We've received your payment and are preparing your package.</p>
          </div>
          
          <div class="content">
            <div class="order-details">
              <div class="detail-row">
                <span class="detail-label">Transaction ID</span>
                <span class="detail-value" style="color: #ea580c;">${transactionId}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Order Date</span>
                <span class="detail-value">${formattedDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Payment Status</span>
                <span class="detail-value" style="color: #10b981; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; background-color: #ecfdf5; padding: 2px 8px; border-radius: 4px;">Success</span>
              </div>
            </div>

            <h3 style="color: #2d3748; font-size: 16px; font-weight: 700; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">Order Summary</h3>
            <table class="items-table">
              <thead>
                <tr style="background-color: #f8fafc; border-bottom: 2px solid #edf2f7;">
                  <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 700; color: #718096; text-transform: uppercase;">Product</th>
                  <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 700; color: #718096; text-transform: uppercase;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${productsListHtml}
                <tr class="total-row">
                  <td style="padding: 16px 12px 12px 12px; text-align: left; font-size: 16px; font-weight: 700; color: #2d3748;">Total Paid</td>
                  <td style="padding: 16px 12px 12px 12px; text-align: right; font-size: 20px; font-weight: 800; color: #ea580c;">
                    $${Number(amount).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="btn-container">
              <a href="${process.env.VITE_CLIENT_URL || "http://localhost:5173"}/dashboard/payment-history" class="btn">View Order History</a>
            </div>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} TechZy. All rights reserved.</p>
            <p>Need support? Contact us at <a href="mailto:support@techzy.com">support@techzy.com</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM || `"TechZy Support" <no-reply@techzy.com>`,
      to: email,
      subject: `Order Confirmed! Your TechZy Receipt [${transactionId.slice(-8).toUpperCase()}]`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Success: Receipt email sent to ${email}. Message ID: ${info.messageId}`);
    
    // If dynamic test account was used, log the ethereal preview URL!
    if (!process.env.SMTP_HOST) {
      console.log(`[Email Service] 🔗 Ethereal Sandbox Link: ${nodemailer.getTestMessageUrl(info)}`);
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("[Email Service] Critical Failure sending email:", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendPaymentReceiptEmail,
};
