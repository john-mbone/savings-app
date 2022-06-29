const express = require('express')

const router = express.Router()

const controller = require('../../controllers/savings')

const redis = require('ioredis')

const client = new redis()

const cache = (req, res, next) => {
    const { savings_id } = req.body;

    let _id = `savings-${savings_id}`

    client.get(id, (error, result) => {
        if (error) throw error;
        if (result !== null) {
            return res.json(JSON.parse(result));
        } else {
            return next();
        }
    });
};

router.post('/save', controller.save)

module.exports = router