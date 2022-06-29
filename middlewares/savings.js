
const redis = require('ioredis')
const moment = require('moment');
const { fDateTimeSuffixShort } = require('../utils/formatTime');

const client = new redis()

// check if user had saved today
const dateCache = async (req, res, next) => {
    const savings_id = req.savings_id;

    let _id = `last-savings-on-${savings_id}`

    await client.get(_id, (error, result) => {
        if (error) throw error;
        if (result !== null) {
            // Validate if date string is valid
            if (moment(new Date(result), "YYYY-MM-DD", true).isValid()) {
                // get current time for comparison with assumed old time
                const current_time = new Date(fDateTimeSuffixShort(new Date())).getTime()
                const old_time = new Date(result).getTime()
                if (current_time > old_time) {
                    res.status(409).json({ status: false, current_time, message: 'You had already saved today.' })
                } else {
                    next()
                }
            } else {
                next()
            }

        } else {
            return next();
        }
    });
};


module.exports = dateCache