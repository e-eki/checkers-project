
module.exports = {
    version: '1.0'
    , server: {
        port: 3000
        , host: 'localhost' 
        //, protocol: 'http' // "https",
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
};