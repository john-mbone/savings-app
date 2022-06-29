const express = require('express')

const router = express.Router()

const controller = require('../../controllers/transactions')

const redis = require('ioredis')

const client = new redis()
// List Transactions
/**
 * 
 * @queryParams ?page=1&page_size=5&from=2022-06-10&to=2022-06-29
*/

router.get('/range', controller.transactionsHistoryWithRange)

// List Transactions
/**
 * 
 * @queryParams ?page=1&page_size=5
 * @resource /transactions?page=1&page_size=10
*/
router.get('/', controller.transactionsHistory)

module.exports = router