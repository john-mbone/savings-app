const express = require('express')

const router = express.Router()

const controller = require('../../controllers/transactions')

const redis = require('ioredis')

const client = new redis()

// router.post('/save', controller.save)

module.exports = router