const express = require('express');
const axios = require("axios");
const urlBuilder = require('./../../utils/url/api-url');

const router = express.Router();

router.get('*', (req, res) => {
    axios.get(urlBuilder(req.originalUrl))
        .then(response => res.json(response.data))
});

module.exports = router;
