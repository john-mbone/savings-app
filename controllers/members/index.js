const { members, savings_account, sequelize } = require('../../models')
const { hashPassword, comparePassword, generateAccessToken } = require('../../utils/security')

const redisServer = require('ioredis')

const redis = new redisServer()

exports.register = async (req, res) => {
    const { username, name, password } = req.body

    // Validate request data
    if (username && name && password) {

        /*
           Here we are checking if the user exists in the database with the above username

           if they exist return an object with status false
        */
        const exist = await members.findOne({
            where: {
                username
            }
        })

        if (exist) {
            // username exists
            res.json({ status: false, message: 'Username already in use.' })
        } else {
            const userPassword = await hashPassword(password)

            // Use managed transaction to rollback automatically incase of errors
            const data = await sequelize.transaction(async (t) => {
                const lastLogin = new Date().getTime()
                const member = await members.create({ username, name, password: userPassword, lastLogin }, { transaction: t })
                member.password = undefined

                // create savings account
                const account = await savings_account.create({
                    account_description: name,
                    member_id: member.id
                }, { transaction: t })

                return {
                    account,
                    member
                };

            });

            res.json({ status: true, message: 'Registration was successful.', data })
        }

    } else {
        res.status(403).json({ status: false, message: 'Invalid request' })
    }

}


exports.signIn = async (req, res) => {
    const { username, password } = req.body

    // Validate request data
    if (username && password) {
        const member = await members.findOne({
            where: {
                username
            }
        })

        // if member does not exist, we should return 401
        if (member) {
            // username exists

            if (await comparePassword(password, member.password)) {
                const account = await sequelize.transaction(async (t) => {
                    const savings_accounts = await savings_account.findOne({
                        where: {
                            member_id: member.id
                        }
                    })

                    const lastLogin = new Date().getTime()
                    // update last login to current time
                    await members.update({ lastLogin }, {
                        where: {
                            id: member.id
                        }
                    }, { transaction: t })

                    return savings_accounts
                })


                // Lets cache last savings date if its not empty to help us return qr on savings

                const entry_id = `last-savings-on-${account.id}`
                console.log(entry_id);
                await redis.set(entry_id,account.last_savings_date)

 


                /**
                 * Lets store savings_id in claims
                 */
                const claims = {
                    savings_id: account.id
                }

                member.password = undefined
                const access_token = await generateAccessToken(claims, 9600)
                res.json({
                    status: true, message: 'Login was successful.', data: {
                        account,
                        member
                    },
                    access_token
                })
            } else {
                res.json({ status: false, message: 'Invalid username or password.' })
            }
        } else {
            res.status(401).json({ status: false, message: 'Invalid username or password.' })
        }

    } else {
        res.status(403).json({ status: false, message: 'Invalid request' })
    }

}