const nodemailer = require('nodemailer');
const emailConfig = require('../config/email');
const util = require('util');


let transporter = nodemailer.createTransport({
    service: emailConfig.service,
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    }
});

exports.enviar = async (opciones) => {
     // send mail with defined transport object
 let info =  {
    from: '"ZapTalent" <no-reply@ZapTalent.cl>', // sender address
    to: opciones.userconfi.email, // list of receivers
    subject: opciones.subject, // Subject line
    text: "Hola Porfavor si quiere seguir utilizando en totalidad su cuenta verifique su Email", // plain text body
    html: opciones.archivo, // html body
  };
  const enviarEmail = util.promisify(transporter.sendMail, transporter)
  return enviarEmail.call(transporter, info)
}
