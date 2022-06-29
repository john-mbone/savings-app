
const redis = require('ioredis')

const client = new redis()

// check if user had saved today
const dateCache = async (req, res, next) => {
    const { amount, date } = req.body
    if (!(amount && date)) {
        return res.status(400).json({ status: false, message: 'Bad Request' })
    }

    const savings_id = req.savings_id;

    let _id = `last-savings-on-${savings_id}`

    await client.get(_id, (error, result) => {
        if (error) throw error;
        if (result !== null) {
            const storedTime = new Date(result).getTime()
            const entryTime = new Date(date).getTime()
            if (storedTime < entryTime) {
                next()
            } else if (storedTime > entryTime) {
                res.json({ status: false, message: `You can not save for the past days` })
            }else{
                res.json({ status: false, message: `You have already saved for this day.` })
            }
        } else {
            next();
        }
    });

};


module.exports = dateCache