/* eslint-disable no-underscore-dangle */
/* eslint-disable object-shorthand */
/* eslint-disable func-names */
/* eslint-disable camelcase */
const mongoose = require('mongoose');
const schemas = require("../schemas");

const HeroModel = mongoose.model('Hero', schemas.HeroSchema);

module.exports = {
    Hero: function({
        id,
        name,
        localized_name,
        primary_attr,
        attack_type,
        roles,
    }) {
        this.id = id;
        this.name = name;
        this.localized_name = localized_name;
        this.primary_attr = primary_attr;
        this.attack_type = attack_type;
        this.roles = roles;
    },

    getById(id) {
        return HeroModel.findOne({ id });
    },

    getAll() {
        return HeroModel.find();
    },

    delete(id) {
        return HeroModel.deleteOne({ id });
    },

    insert(hero) {
        const mod = new HeroModel(hero);
        return mod.save();
    },

    update(updatedHero) {
        return HeroModel.findOneAndUpdate({ id: updatedHero.id }, updatedHero, { new: true });
    },
}