const express = require('express');
const axios = require("axios");
const heroesDB = require('../../models/Hero');
const urlBuilder = require('./../../utils/url/api-url');

const router = express.Router();

const heroesUrl = urlBuilder('/api/heroes');

async function getHeroesFromApi() {
    const heroes = await axios.get(heroesUrl).then(r => r.data);
    return heroes;
}

async function equalizeHeroesForDbAndApi() {
    const allHeroesFromApi = await getHeroesFromApi();
    const allHeroesFromDB = await heroesDB.getAll();
    // Add new heroes
    await Promise.all (allHeroesFromApi
        .filter(hero => !allHeroesFromDB.find(x => x.id === hero.id))
        .map(hero => heroesDB.insert(new heroesDB.Hero(hero)))
    );
    // Update old ones
    await Promise.all (allHeroesFromApi
        .filter(hero => 
            !allHeroesFromDB.find(x => JSON.stringify(x) === JSON.stringify(hero))
        )
        .map(hero => heroesDB.update(hero))
    );
}

router.get('/db/pull', async (req, res) => {
    await equalizeHeroesForDbAndApi();
    res.sendStatus(200);
});

module.exports = router;

