const mongoose = require('mongoose');

const { Schema } = mongoose;

const MatchSchema = new Schema({
    match_id: { type: Number, require: true },
    duration: { type: Number, require: true },
    players: [{
        hero_id: { type: Number },
        gold_per_min: { type: Number },
        total_gold: { type: Number },
    }],
});

const HeroSchema = new Schema({
    id: { type: Number, require: true },
    name: { type: String, require: true },
    localized_name: { type: String, require: true },
    primary_attr: { type: String, require: true },
    attack_type: { type: String, require: true },
    roles: [{
        type: String
    }],
    matchups: [{
        hero_id: { type: Number },
        games_played: { type: Number },
        wins: { type: Number },
    }],
});


module.exports = {
    MatchSchema,
    HeroSchema,
}