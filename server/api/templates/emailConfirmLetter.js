
const config = require('../../config');

module.exports = new function() {

    this.get = function(data) {
        
	let letter =  
		`<!DOCTYPE HTML>
		<html>
			<head>
				<meta charset="utf-8">
				<title>Подтверждение адреса электронной почты на сайте «Игра в шашки онлайн.»</title>
				<style type="text/css">
					.wrapper {
						margin: 5vmin;
					}
				</style>
			</head> 
			<body>
				<div class="wrapper">
					<p>Здравствуйте, ${data.login}!</p>
					<p>Мы рады приветствовать вас на нашем сайте!
					<br/>Чтобы продолжить регистрацию, перейдите по <a href="http://localhost:3000/api/emailconfirm/${data.confirmEmailCode}/">ссылке</a>.</p>
					<p>Ваша «Игра в шашки онлайн».
					<br/><a href="http://localhost:3000">На главную страницу</a></p>
				</div>
			</body>
		</html>`;

		return letter;
    }
};
