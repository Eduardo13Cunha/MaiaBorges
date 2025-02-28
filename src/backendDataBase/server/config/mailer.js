import nodemailer from 'nodemailer';

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'itparkmanager.pap@gmail.com',
    pass: 'obek yzjf drgc jtuc'
  }
});

export default transporter;