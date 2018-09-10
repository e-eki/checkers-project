
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const config = require('./config');
//const api = require('./api/routes'); // импортируем роуты

const indexHTML = path.resolve(__dirname,'./public/index.html');
const app = express();
const port = 3000;

// статические файлы
app.use('/', express.static('public'));

// запросы к api в отдельном файле
//app.use('/api', api);

// на все остальные запросы отдаем главную страницу
app.get('/*', (req, res) => res.sendFile(indexHTML));

app.listen(port, (err) => {
    if (err) {
        return console.log('error', err);
    }
    console.log(`server is listening on ${port}`);
});
