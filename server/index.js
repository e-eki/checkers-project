
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const config = require('./config');
const mongoDbUtils = require('./api/lib/mongoDbUtils');

const indexHTML = path.resolve('./front-end/public/index.html');
const app = express();
const port = 3000;

// статические файлы
//app.use('/', express.static('front-end/public'));
app.use(express.static('front-end/public'));

app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
    });

    if (req.method === 'OPTIONS') {
        return res.set({'Allow': 'OPTIONS, GET, POST, PUT, DELETE'}).status(200).end();
    }
    next();
});

app.use(bodyParser.json({type: 'application/json'}));
//app.use(bodyParser.urlencoded({ extended: true }));

//соединение с БД
mongoDbUtils.setUpConnection();

// ---------------------------------------------------------------
// запросы к api
//app.use('/api', api);
//app.use('/api', require('./api/auth/login'));
//app.use('/api', require('./api/auth/logout'));
//app.use('/api', require('./api/auth/session'));
app.use('/api', require('./api/auth/registration'));
app.use('/api', require('./api/auth/emailConfirm'));

//app.use('/api', require('./api/routes/test'));
app.use('/api', require('./api/routes/user'));

// ---------------------------------------------------------------


// на все остальные запросы отдаем главную страницу
app.get('/*', (req, res) => res.sendFile(indexHTML));

// Если произошла ошибка валидации, то отдаем 400 Bad Request
app.use((req, res, next) => {
    return res.status(404).send(`url does not exist: ${req.url}`);
});

// Если же произошла иная ошибка, то отдаем 500 Internal Server Error
app.use((err, req, res, next) => {
    /*if (err && err.stack) {
        console.error(err.stack);
    }*/

    const status = 500;
    return res.status(status).send({statusCode: status, data: null, error: {name: 'server_error', message: err.message}});
});

app.listen(config.server.port, () => {
    console.log(`Hosted on:  ${config.server.host}:${config.server.port}`);
});
