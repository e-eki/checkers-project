
module.exports = {
    version: '1.0'
    , server: {
        port: 3000
        , host: 'localhost' 
        , protocol: 'http' // "https"
    }
    , db : {
        mongo : {
            url: 'mongodb://e:e123456@ds046677.mlab.com:46677/ch'
            , options: {
                autoReconnect: (process.env.NODE_ENV == 'production')
                , useNewUrlParser: true 
            }
        }
    }
    , bcrypt: {
        saltLength: 10
    } 
    , mail_settings: {
        service: 'Gmail' 
        , auth: { 
            user: 'viktoriadremina1990@gmail.com', 
            pass: 'qwerty12345_'
        }
        , from: '"Игра в шашки онлайн." <checkers-game-online@gmail.com>'
        , confirmEmailSubject: 'Подтверждение адреса электронной почты на сайте «Игра в шашки онлайн.»'
    }

    , token: {
        secret: 'Ym9yc2NodA=='
        , access: {
            expiresIn: 600000   //10 мин = 10*60*1000
          },
        
          refresh: {
            expiresIn: 3600000  //60 мин
          },
    }
};