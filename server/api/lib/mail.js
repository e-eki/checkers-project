
const Promise = require('bluebird');
const nodemailer = require('nodemailer');

const config = require('../../config');

module.exports = {

	sendConfirmEmailLetter: function(data) {

		let transport = nodemailer.createTransport({
			service: 'Gmail', 
			auth: { 
				user: 'viktoriadremina1990@gmail.com', 
				pass: 'qwerty12345_'
			}
		});

		const letterHtml = require('../templates/emailConfirmLetter').get(data);

		return transport.sendMail({
			from: '"Игра в шашки онлайн." <checkers-game-online@gmail.com>' ,
			to: 'ifirtree@gmail.com',  //!!!TODO: data.email
			subject: 'Подтверждение адреса электронной почты на сайте «Игра в шашки онлайн.»',
			html: letterHtml
		})
            .then((result) => {
				
                transport.close();
                return result;
            });
	}
}