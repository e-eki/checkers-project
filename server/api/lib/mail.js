
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

		return transport.sendMail({
			from: 'viktoriadremina1990@gmail.com',
			to: 'ifirtree@gmail.com',
			subject: 'Регистрация на сайте',
			text: 'Какой то текст',
			html:'<p>HTML version of the message</p>'
		})
            .then((result) => {

                transport.close();
                return result;
            });
	}
}