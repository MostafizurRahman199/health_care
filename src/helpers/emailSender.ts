import nodemailer from 'nodemailer';
import config from '../config';

const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.app_pass,
    },
  });

  await transporter.sendMail({
    from: `"Health Care" <${config.emailSender.email}>`, // sender address
    to, // list of receivers
    subject, // Subject line
    html, // html body
  });
};

export const emailHelper = {
  sendEmail,
};
