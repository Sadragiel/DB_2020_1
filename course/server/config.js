if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

module.exports = {
    serverPort: process.env.SERVER_PORT,
    databaseUrl: "mongodb://127.0.0.1:27017/dotastuff"
};