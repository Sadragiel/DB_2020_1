/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
const axios = require("axios");
const urlBuilder = require('./../../utils/url/api-url');
const matchesDB = require('../../models/Match');
const heroDB = require('../../models/Hero');


async function saveMatches(idsOfMatchesToSave) {
    const urlByMatch = id => urlBuilder(`/api/matches/${id}`);
    const matches = [];
    for(let match_id of idsOfMatchesToSave.slice(0, 10)) {
        const matchMeta = await axios.get(urlByMatch(match_id)).then(r => r.data);
        const match = new matchesDB.Match(matchMeta);
        matches.push(match);
        await matchesDB.insert(match);
    }
    return matches;
}

module.exports = {
    getMatches: async (hero) => {
        const urlByHero = id => urlBuilder(`/api/heroes/${id}/matches`);
        const allSavedMatches = await matchesDB.getAll();

        const matchesID = await axios.get(urlByHero(hero.id))
            .then(r => r.data)
            .then(matches => matches.map(match => match.match_id));

        const idsOfMatchesToSave = matchesID
            .filter(matchId => !allSavedMatches.find(x => x.match_id === matchId));
        
        const savedMatches = await saveMatches(idsOfMatchesToSave);
        const matches = savedMatches;

        for(let match_id 
            of matchesID.filter(mid => 
                !idsOfMatchesToSave.find(x => mid !== x)
            )
        ) {
            const match = await matchesDB.getById(match_id);
            matches.push(match);
        }
        return matches;
    },
    getMatchups: async (hero_id) => {
        const url = urlBuilder(`/api/heroes/${hero_id}/matchups`);
        const hero = await heroDB.getById(hero_id); 
        if(!hero.matchups || !hero.matchups.length) {
            const matchups = await axios.get(url).then(r => r.data);
            hero.matchups = matchups;
        }
        return hero.matchups;
    },
    bench: async (hero_id) => {
        const url = new URL(urlBuilder('/api/benchmarks'))
        url.searchParams.set('hero_id', hero_id);
        const data = await axios.get(url.toString()).then(r => r.data);
        return data.result.gold_per_min;
    }
}