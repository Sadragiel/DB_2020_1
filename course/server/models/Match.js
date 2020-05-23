/* eslint-disable object-shorthand */
/* eslint-disable func-names */
/* eslint-disable camelcase */
const mongoose = require('mongoose');
const schemas = require("../schemas");

const MatchModel = mongoose.model('Match', schemas.MatchSchema);

module.exports = {
    Match: function({
        match_id,
        duration,
        players
    }) {
        this.match_id = match_id;
        this.duration = duration;
        this.players = players.map(p => ({
            hero_id: p.hero_id,
            gold_per_min: p.gold_per_min,
            total_gold: p.total_gold,
        }));
    },

    getById(match_id) {
        return MatchModel.findOne({ match_id });
    },

    getAll() {
        return MatchModel.find();
    },

    delete(match_id) {
        return MatchModel.deleteOne({ match_id });
    },

    insert(match) {
        const mod = new MatchModel(match);
        return mod.save();
    },
}