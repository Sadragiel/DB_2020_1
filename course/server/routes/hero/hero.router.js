const express = require('express');
const axios = require("axios");
const urlBuilder = require('./../../utils/url/api-url');

const router = express.Router();

router.get('/api/benchmarks', async (req, res) => {
    const url = urlBuilder(req.originalUrl);
    const response = await axios.get(url).then(r => r.data);
    console.log(response);

    res.json(response);
});

module.exports = router;

