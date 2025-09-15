

const otptemplate = (otp, name) => {
  const date = new Date();
  const year = date.getFullYear();
  return `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Medicare Account Verification</title>
  </head>
  <body>
    <table width="100%" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;background-color:#ffffff;color:#57584e;font-size:16px;line-height:24px;max-width:600px;margin:0 auto;padding:20px">
      <tbody>
        <tr>
          <td style="padding:30px;text-align:center">
            <h2>Medicare Store</h2>
          </td>
        </tr>
        <tr>
          <td>
            <div style="border:1px solid #ccd1d6;padding:30px;border-radius:8px;text-align:center">
              <p style="font-size:18px;font-weight:500;color:#010b14;margin-bottom:5px">
                Verify Your Email Address
              </p>
             <p style="font-size:16px;color:#57584e;margin:0">
                Hi <strong>${name}</strong>, thanks for signing up for a <strong>Medicare Account</strong>!  
                Please verify your email by entering the OTP code below:
              </p>
              <p style="font-size:24px;color:#2a9d8f;font-weight:700;margin:20px 0">
                ${otp}
              </p>
              <p style="font-size:16px;color:#57584e;margin:0">
                This OTP is valid for the next <strong>15 minutes</strong>. If you didn’t create this account, you can safely ignore this message.
              </p>
              <div style="margin-top:24px;text-align:center">
                <a href="https://your-website.com/verify" style="display:inline-block;padding:12px 24px;background-color:#2a9d8f;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;border-radius:6px" target="_blank">
                  Verify Now
                </a>
              </div>
              <div style="width:100%;border-bottom:1px solid #ccd1d6;margin:24px 0"></div>
              <p style="font-size:16px;color:#57584e;margin:0">
                Need help? Contact us at <a href="mailto:support@medicare.com">support@medicare.com</a>
              </p>
              <p style="font-size:16px;color:#57584e;margin-top:24px">Welcome aboard and happy shopping!</p>
              <table width="100%" align="center" style="border-collapse:collapse;font-size:14px;color:#666666;margin-top:20px;border:0;text-align:center">
                <tbody>
                  <tr style="height:36px">
                    <td style="padding:5px 0">© Medicare ${year}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>

`;
};
const resetsuccess = (name) => {
  const date = new Date();
  const year = date.getFullYear();

  return `
    <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset Successful</title>
</head>

<body>
  <table width="100%"
    style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;background-color:#ffffff;color:#57584e;font-size:16px;line-height:24px;max-width:600px;margin:0 auto;padding:20px">
    <tbody>
      <tr>
        <td style="padding:30px;text-align:center">
          <h2>Medicare Store</h2>
        </td>
      </tr>
      <tr>
        <td>
          <div style="border:1px solid #ccd1d6;padding:30px;border-radius:8px;text-align:center">
            <p style="font-size:18px;font-weight:500;color:#010b14;margin-bottom:10px">
              Password Reset Successful
            </p>
            <p style="font-size:16px;color:#57584e;margin:0">
              Hi ${name},
            </p>
            <p style="font-size:16px;color:#57584e;margin-top:10px">
              Your password has been successfully reset for your <strong>medicare Account</strong>. You can now log in
              using your new password.
            </p>
            <div style="margin:24px 0;text-align:center">
              <a href="https://your-website.com/login"
                style="display:inline-block;padding:12px 24px;background-color:#4caf50;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;border-radius:6px"
                target="_blank">
                Log In Now
              </a>
            </div>
            <p style="font-size:16px;color:#57584e;margin:0">
              If you didn’t make this change, please contact our support team immediately.
            </p>
            <div style="width:100%;border-bottom:1px solid #ccd1d6;margin:24px 0"></div>
            <p style="font-size:16px;color:#57584e;margin:0">
              Need help? Reach us at <a href="mailto:support@medicare.com">support@medicare.com</a>
            </p>
            <p style="font-size:16px;color:#57584e;margin-top:24px">Thanks for shopping with us!</p>
            <table width="100%" align="center"
              style="border-collapse:collapse;font-size:14px;color:#666666;margin-top:20px;border:0;text-align:center">
              <tbody>
                <tr style="height:36px">
                  <td style="padding:5px 0">© Medicare ${year}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</body>

</html>`;
};

const registertemplate = (name) => {
  const date = new Date();
  const year = date.getFullYear();

  return `
 <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Payment Receipt</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f7f7f7;font-family:Arial, sans-serif;">
    <table width="100%" cellspacing="0" cellpadding="0" style="background-color:#f7f7f7;padding:20px 0">
      <tr>
        <td>
          <!-- Header -->
          <table width="600" align="center" cellpadding="0" cellspacing="0" style="background-color:#1976d2;color:#ffffff;padding:20px;border-radius:8px 8px 0 0">
            <tr>
              <td align="center">
                <h1 style="margin:0;font-size:22px">Medicare Store</h1>
                <p style="margin:5px 0 0;font-size:16px">Payment Receipt</p>
              </td>
            </tr>
          </table>

          <!-- Body -->
          <table width="600" align="center" cellpadding="0" cellspacing="0" style="background-color:#ffffff;padding:30px;border:1px solid #e0e0e0;border-top:0">
            <tr>
              <td>
                <p style="font-size:16px;color:#333;margin:0">Hello <strong>${name}</strong>,</p>
                <p style="margin-top:10px;font-size:16px;color:#555">
                  Thank you for your purchase! Here are your payment details:
                </p>

                <table width="100%" style="margin-top:20px;border-collapse:collapse">
                  <tr>
                    <td style="padding:8px;border-bottom:1px solid #eee">Order ID:</td>
                    <td style="padding:8px;border-bottom:1px solid #eee"><strong>#${orderId}</strong></td>
                  </tr>
                  <tr>
                    <td style="padding:8px;border-bottom:1px solid #eee">Payment Method:</td>
                    <td style="padding:8px;border-bottom:1px solid #eee">${paymentMethod}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px;border-bottom:1px solid #eee">Amount Paid:</td>
                    <td style="padding:8px;border-bottom:1px solid #eee"><strong>${amount}</strong></td>
                  </tr>
                  <tr>
                    <td style="padding:8px;border-bottom:1px solid #eee">Date:</td>
                    <td style="padding:8px;border-bottom:1px solid #eee">${paymentDate}</td>
                  </tr>
                </table>

                <div style="margin:24px 0;text-align:center">
                  <a href="https://your-website.com/orders/${orderId}" style="display:inline-block;padding:12px 24px;background-color:#1976d2;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:6px" target="_blank">
                    View Your Order
                  </a>
                </div>

                <p style="font-size:15px;color:#555;margin-top:10px">
                  If you have any questions, feel free to contact our support team.
                </p>
              </td>
            </tr>
          </table>

          <!-- Footer -->
          <table width="600" align="center" cellpadding="0" cellspacing="0" style="background-color:#f1f1f1;color:#777;font-size:13px;padding:20px;border-radius:0 0 8px 8px">
            <tr>
              <td align="center">
                <p style="margin:0">© Medicare ${year}. All rights reserved.</p>
                <p style="margin:5px 0 0">
                  Need help? Email us at <a href="mailto:support@medicare.com" style="color:#1976d2;text-decoration:none">support@medicare.com</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

`;
};
const logintemplate = (name) => {
  const date = new Date();
  const year = date.getFullYear();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome Back</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f6fa;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #ddd">
          <tr>
            <!-- Left sidebar / banner -->
            <td width="200" style="background:#1976d2;color:#ffffff;vertical-align:top;padding:30px;text-align:center">
              <h2 style="margin:0 0 10px;font-size:22px">Medicare</h2>
              <p style="margin:0;font-size:14px;line-height:20px">
                Your trusted store<br/>for health & wellness
              </p>
            </td>

            <!-- Right content -->
            <td width="400" style="padding:30px;vertical-align:top;color:#333333">
              <h3 style="margin:0;font-size:20px;color:#222">
                Welcome Back, ${name}! 🎉
              </h3>
              <p style="margin:15px 0;font-size:15px;line-height:22px;color:#555">
                You’ve successfully logged in to <strong>Your Medicare Store</strong>.  
                Here’s how to make the most out of your visit:
              </p>

              <ul style="margin:15px 0;padding-left:20px;color:#555;font-size:15px;line-height:24px">
                <li>Shop across categories with exclusive offers</li>
                <li>Access your saved favorites anytime</li>
                <li>Fast checkout & doorstep delivery</li>
                <li>Track your orders live</li>
              </ul>

              <div style="margin:20px 0;text-align:left">
                <a href="https://yourmedicarestore.com" style="display:inline-block;padding:12px 24px;background:#28a745;color:#ffffff;text-decoration:none;font-weight:600;border-radius:4px">
                  Start Shopping
                </a>
              </div>

              <p style="margin-top:10px;font-size:14px;color:#777">
                Need help? Contact us at 
                <a href="mailto:support@yourmedicare.com" style="color:#1976d2;text-decoration:none">support@yourmedicare.com</a>
              </p>
              <p style="margin-top:20px;font-size:13px;color:#999">
                © Your Medicare Store ${year}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>

`;
};

module.exports = { otptemplate, resetsuccess, registertemplate, logintemplate };
