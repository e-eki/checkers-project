
module.exports = {
    version: '1.0'
    , server: {
        port: 3000
        , host: 'localhost' 
        //, protocol: 'http' // "https",
    }
    , db : {
        mongo : {
            url: 'mongodb://<eeki>:<eeki1234>@ds251332.mlab.com:51332/checkers'
        }
    }, 
};