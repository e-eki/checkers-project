
const Promise = require('bluebird');
const nodemailer = require('nodemailer');

const config = require('../../config');

module.exports = {

	sendConfirmEmailLetter: function(data) {

		let transport = nodemailer.createTransport({
			service: config.mail_settings.service, 
			auth: { 
				user: config.mail_settings.auth.user 
				, pass: config.mail_settings.auth.pass
			}
		});

		const letterHtml = require('../templates/emailConfirmLetter').get(data);

		return transport.sendMail({
			from: config.mail_settings.from,
			to: 'ifirtree@gmail.com',  //!!!TODO: data.email
			subject: config.mail_settings.confirmEmailSubject,
			html: letterHtml
		})
            .then((result) => {
				
                transport.close();
                return result;
            });
	}
}