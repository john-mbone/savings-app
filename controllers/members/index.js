const { members, savings_account, sequelize } = require('../../models')
const { hashPassword } = require('../../utils/security')

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

            req.body.password = userPassword





            // Use managed transaction to rollback automatically incase of errors
            const data = await sequelize.transaction(async (t) => {
                const member = await members.create(req.body, { transaction: t })
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
        const exist = await members.findOne({
            where: {
                username
            }
        })

        if (exist) {
            // username exists
            res.json({ status: false, message: 'Username is already in use.' })
        } else {
            res.status(401).json({ status: false, message: 'Invalid username or password.' })
        }

    } else {
        res.status(403).json({ status: false, message: 'Invalid request' })
    }

}