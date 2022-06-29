const express = require('express')

const router = express.Router()

const controller = require('../../controllers/members')

/**
* @api {post} /members/register Create user
* @apiName Create new user
* @apiPermission open
* @apiGroup User
*
* @apiParam  {String} [username] username
* @apiParam  {String} [password] Password
* @apiParam  {String} [name] Name
*
* @apiSuccess (200) {Object} mixed `{status,message,data}` object
*/
router.post('/register', controller.register)

module.exports = router