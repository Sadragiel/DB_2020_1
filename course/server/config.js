if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

module.exports = {
    serverPort: process.env.SERVER_PORT,
    databaseUrl: "mongodb://heroku_user:porter2556@ds249873.mlab.com:49873/lab6db"
};