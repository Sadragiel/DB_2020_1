/* eslint-disable camelcase */
const express = require('express');
const staticticLybrary = require('simple-statistics');
const getHelper = require('../../utils/proxy/get-helper');
const heroDB = require('../../models/Hero');

const router = express.Router();


async function getSetForRegression(heroId) {
        const hero = await heroDB.getById(heroId);
        const matches = await getHelper.getMatches(hero);
        const durations = matches.map(match => match.duration);
        const players =  matches.map(({ players  }) =>
            players.find(player => player.hero_id === heroId));
        const goldPerMinuteAveranges = players.map(player => player.gold_per_min);
        const totalGold = players.map(player => player.total_gold);
    
        return {
            goldPerMinuteRegressionData: durations.map((duration, i) => [duration, goldPerMinuteAveranges[i]]),
            totalGoldRegressionData: durations.map((duration, i) => [duration, totalGold[i]])
        };
}

function getLinePoints({ m: k, b }) {
    // eslint-disable-next-line no-mixed-operators
    const func = x => k * x + b;
    const points = [];
    points.push({
        percentile: 0, 
        value: func(0)
    });
    points.push({
        percentile: 1, 
        value: func(1)
    });
    return points;
}

function transformPointsToSets(points) {
    return points.reduce((acc, cur) => {
        acc[0].push(cur[0]);
        acc[1].push(cur[1]);
        return acc;
    }, [[],[]]);
}

router.get('/api/benchmarks', async (req, res) => {
    const {
        goldPerMinuteRegressionData,
        totalGoldRegressionData,
    } = await getSetForRegression(+req.query.hero_id);
    
    const GPM_lineMetadata = staticticLybrary.linearRegression(goldPerMinuteRegressionData);
    const TG_lineMetadata = staticticLybrary.linearRegression(totalGoldRegressionData);
    
    const GPM_points = getLinePoints(GPM_lineMetadata);
    const TG_points = getLinePoints(TG_lineMetadata);

    const GPM_correlationData = transformPointsToSets(goldPerMinuteRegressionData);
    const TG_correlationData = transformPointsToSets(totalGoldRegressionData);

    const GPM_correlation = staticticLybrary.sampleCorrelation(...GPM_correlationData).toFixed(2);
    const TG_correlation = staticticLybrary.sampleCorrelation(...TG_correlationData).toFixed(2);

    res.json({
        hero_id: req.query.hero_id,
        result: {
            gold_per_min: GPM_points,
            xp_per_min: TG_points,
        },
        correlation: {
            gold_per_min: GPM_correlation,
            xp_per_min: TG_correlation,
        },
    });
});

router.get('/api/heroes/:hero_id/matchups', async (req, res) => {
    const id = +req.params.hero_id;
    const matchups = await getHelper.getMatchups(id);
    res.json(matchups);
});

module.exports = router;

