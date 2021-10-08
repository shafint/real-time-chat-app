const nodemailer = require("nodemailer");

async function sentMail(userEmail, username, token) {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MSG_EMAIL,
        pass: process.env.MSG_EMAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: process.env.MSG_EMAIL,
      to: userEmail,
      subject: "Chat-applications activation message",
      html: `<div>
                            <p style="background:#f1fc88;color:#444">Dear ${username},</p>
                            <p>This is an e-mail confirmation message.Complete your account verification by clicking the button below👇👇👇👍👍
                            </p>
                        <center>
                            <a href="http://localhost:5000/user/api/veryfy?token=${token}">
                            <button style="
                            background-color: #4CAF50;
                            border: none;
                            color: white;
                            padding: 15px 32px;
                            text-align: center;
                            text-decoration: none;
                            display: inline-block;
                            font-size: 16px;"> Click to verify </button>
                            </a>
                        </center>
                       </div>`,
    });
    if (info.rejected.length > 0) {
      console.log(info);
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  sentMail,
};
