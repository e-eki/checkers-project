
const config = require('../../config');
  
const successConfirmPage =  
	`<!DOCTYPE HTML>
	<html>
		<head>
			<meta charset="utf-8">
			<title>Успешное подтверждение имейла</title>
			<style type="text/css">
				.wrapper {
					margin: 10vmin;
				}
			</style>
		</head> 
		<body>
			<div class="wrapper">
				<p>Поздравляем, вы успешно зарегистрировались на сайте!</p>
				<p><a href="http://localhost:3000">Перейти на главную страницу</a></p>
			</div>
		</body>
	</html>`;

module.exports = successConfirmPage;
