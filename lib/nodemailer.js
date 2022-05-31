const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  pool: true,
  host: process.env.EMAIL_SMTP_HOST || "smtp.mailtrap.io",
  port: process.env.EMAIL_SMTP_PORT || 2525,
  auth: {
    user: process.env.EMAIL_SMTP_USER || "00b48373da29ea",
    pass: process.env.EMAIL_SMTP_PASSWORD || "8eb39f55199070",
  },
});

transport.verify(function (error, success) {
  if (error) {
    throw error;
  }
  return success;
});

const EmailResetPasswordToken = (receiver) => {
  let mailOptions = {
    from: "noreply@snds.dev",
    to: receiver,
    subject: "Reset password link.",
    text: "Token anda adalah ...",
    html: "<p>Token anda adalah ...</p>",
  };

  return transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Email sent: " + info.response);
  });
};

module.exports = { EmailResetPasswordToken };
