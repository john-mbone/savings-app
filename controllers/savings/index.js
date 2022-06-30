const { Op } = require("sequelize")
const { sequelize, transaction, savings_account } = require("../../models")
const { fDateTimeSuffixShort } = require("../../utils/formatTime")
const moment = require('moment')
const Redis = require('ioredis')

const redis = new Redis()


/**
 * Requst payload
 * {
    "amount":"",
    "narration":"",
    "date":"2022-06-29"
}
*/
exports.save = async (req, res) => {
    try {
        const { date, narration = '', amount } = req.body
        const savings_id = req.savings_id
        if (isNaN(amount)) {
            return res.status(400).json({ status: false, message: 'Please provide a valid amount to save.' })
        }

        if (parseFloat(amount) < 0) {
            return res.status(400).json({ status: false, message: 'Please provide a valid amount to save.' })
        }

        const today = fDateTimeSuffixShort(new Date())

        const payment_date = new Date(date).getTime()
        const current_time = new Date(today).getTime()

        if (payment_date < current_time) {
            res.status(409).json({ status: false, message: 'You can`t save for the past days.' })
        } else if (payment_date > current_time) {
            res.status(409).json({ status: false, message: 'You can`t save past today.' })
        } else {
            const comparer = moment(date).format('YYYY-MM-DD')

            // Will return transactions for the day the customer saved 
            let oldTransactions = await transaction.findAll({
                where: {
                    createdAt: {
                        [Op.gte]: comparer
                    }
                },

                order: [['id', 'DESC']]
            })

            if (oldTransactions.length > 0) {
                await redis.set(`last-savings-on-${savings_id}`, moment(oldTransactions[0].createdAt).format('YYYY-MM-DD'))
                return res.json({ status: true, message: `You have already saved for ${comparer}` })
            } else {
                // create transaction
                const savingTransaction = await sequelize.transaction(async (t) => {
                    const trx = await transaction.create({
                        amount,
                        savings_id,
                        narration
                    }, { transaction: t })

                    if (trx) {
                        await savings_account.increment({
                            account_balance: amount,
                            total_deposits_derived: amount
                        }, {
                            where: {
                                id: savings_id
                            }
                        }, { t })
                    }
                    return trx
                })

                // Add Key to redis

                await redis.set(`last-savings-on-${savings_id}`, moment(savingTransaction.createdAt).format('YYYY-MM-DD'))
                res.status(201).json({ status: true, message: 'You have successfully saved.' })
            }

        }

    } catch (error) {
        res.status(400).json({ status: false, message: error.message })
    }
}