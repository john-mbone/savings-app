const express = require('express')

const router = express.Router()

const controller = require('../../controllers/savings')

const dateCache = require('../../middlewares/savings')

router.post('/save',dateCache, controller.save)

module.exports = router