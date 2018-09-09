
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

//const api = require('./routes/api'); // импортируем роутер

const indexHTML = path.resolve(__dirname,'./public/index.html');
const app = express();
const port = 3000;

// все статические файлы в папку public
app.use('/', express.static('public'));

// запросы к api выносите в отдельный файл и подключаете как миделвер
//app.use('/api', api);

// на все остальные запросы 
app.get('/*', (req, res) => res.sendFile(indexHTML));

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
});
