const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const busboyBodyParser = require('busboy-body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require("axios");
const config = require('./config');   

const routes = require('./routes');

const app = express();
const PORT = +config.serverPort;

if (!Number.isInteger(PORT)) {
    // eslint-disable-next-line no-console 
    console.error('Bad port, please set PORT as anv variable');
    process.abort();
}

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(busboyBodyParser({}));

app.use('/static', express.static('public'));
app.use(express.static(path.join(`${__dirname  }/../dist/`)));

routes.forEach(rout => app.use(rout));

app.use('*', (req, res) => {
    // res.sendFile(path.join(`${__dirname  }/../dist/index.html`));
    axios.get(`https://api.opendota.com${req.originalUrl}`)
    .then(response => res.json(response.data));
});

app.use((err, req, res) => {
    // eslint-disable-next-line no-console
    console.error(err.stack);
    return res.status(500).end(`Internal srever error: ${err.message}`);
});

let server;

mongoose.connect(config.databaseUrl, { useNewUrlParser: true })
    // eslint-disable-next-line no-console
    .then(() => console.log(`Database connected: ${config.database_url}`))
    .then(() => {
        // eslint-disable-next-line no-console
        server = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    })
    // eslint-disable-next-line no-console
    .catch(err => console.log(`Status error: ${err}`));

// to close connections
process.on('SIGINT', () => {
    server.close(() => {
        // eslint-disable-next-line no-console
        console.log('Server has beed successfully stopped');
    });
})
