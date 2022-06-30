
const redis = require('ioredis');
const { createXLXS } = require('../utils/common');
const moment = require('moment')

const client = new redis()

// check if user requests same range transactions
const transactions = async (req, res, next) => {
    let { from, to } = req.query
    if (!(from && to)) {
        return res.status(400).json({ status: false, message: 'Bad Request' })
    }

    from = moment(from).add(-1).format('YYYY-MM-DD')
    to = moment(to).add(1).format('YYYY-MM-DD')
    const savings_id = req.savings_id;

    let _id = `${savings_id}_${from.replaceAll('-', '_')}_${to.replaceAll('-', '_')}`
    await client.get(_id, (error, result) => {
        if (error) throw error;
        if (result !== null) {
            const transactions = JSON.parse(result)
             createXLXS(transactions, res)
        } else {
            next();
        }
    });

};


module.exports = transactions