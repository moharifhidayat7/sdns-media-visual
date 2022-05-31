import mailer from "../../../lib/nodemailer";

export default async function handler(req, res) {
  const mailOptions = {
    from: '"Example Team" <from@example.com>',
    to: "user1@example.com, user2@example.com",
    subject: "Nice Nodemailer test",
    text: "Hey there, it’s our first message sent with Nodemailer ;) ",
    html: "<b>Hey there! </b><br> This is our first message sent with Nodemailer",
  };

  const result = await mailer.sendMail(mailOptions);

  if (result) {
    res.statusCode = 200;
    res.json(result);
  } else {
    res.statusCode = 500;
    res.json({ err: "Error occured." });
  }
}
