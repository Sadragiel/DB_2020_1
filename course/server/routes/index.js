const heroRouter = require('./hero/hero.router');
const dbRouter = require('./pull-db');

module.exports = [
    heroRouter,
    dbRouter,
];