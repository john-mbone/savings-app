const { transaction } = require('../../models')
const moment = require('moment')
const { Op } = require('sequelize')
const { createXLXS } = require('../../utils/common')

const Redis = require('ioredis')

const redis = new Redis()
// http://localhost:9000/transactions?page=1&page_size=2

exports.transactionsHistory = async function (req, res) {

    const savings_id = req.savings_id
    let count = await transaction.count({
        where: {
            savings_id
        }
    })
    let { page_size, page } = req.query
    let limit = parseInt(page_size)
    page = parseInt(req.query.page) - 1

    let pages = (count / limit)

    let offset = (page) * limit

    let result = await transaction.findAll({
        offset, limit,
        order: [['id', 'DESC']],
        where: {
            savings_id
        }
    })

    if (result.length !== 0) {
        await createXLXS(result, res)
    } else {
        res.json({ status: false, pages: Math.ceil(pages), count, result })
    }
    // res.json({ status: true, pages: Math.ceil(pages), count, result })
}

// Get data in two ranges and send an excel/pdf
// http://localhost:9000/transactions?page=1&page_size=2&from=2022-06-22&to=2022-06-29
exports.transactionsHistoryWithRange = async function (req, res) {

    let { page_size, page, from, to } = req.query
    let limit = parseInt(page_size)
    const savings_id = req.savings_id
    from = moment(from).add(-1).format('YYYY-MM-DD')
    to = moment(to).add(1).format('YYYY-MM-DD')

    // filter transactions by date
    let count = await transaction.count(
        {
            where: {
                createdAt: {
                    [Op.between]: [from, to]
                },
                savings_id
            }
        }
    )

    let pages = (count / limit)

    let offset = (page) * limit


    let result = await transaction.findAll({
        offset, limit,
        order: [['id', 'DESC']],
        where: {
            createdAt: {
                [Op.between]: [from, to]
            },
            savings_id
        }
    })



    if (result.length !== 0) {
        let key_ = `${savings_id}_${from.replaceAll('-', '_')}_${to.replaceAll('-', '_')}`
        await redis.set(key_, JSON.stringify(result))
        await createXLXS(result, res)
    } else {
        res.json({ status: false, pages: Math.ceil(pages), count, result })
    }
    // res.json({ status: true, pages: Math.ceil(pages), count, result })
}




