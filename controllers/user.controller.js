const asyncHandler = require('express-async-handler');
const {body} = require('express-validator/check');
const { PrismaClient } = require('@prisma/client');
const { user } = new PrismaClient();

exports.validate = (method) => {
  switch(method) {
    case 'createUser': {
      return [
        body('email', 'invalid email address').exists().isEmail(),
        body('firstName', 'invalid user firstname').exists().isAlpha(),
        body('lastName', 'invalid user lastname').exists().isAlpha()
      ]
    }
  }
}

/**
* @api {post} /api/user Create user
* @apiName Create new user
* @apiPermission user, admin
* @apiGroup User
*
* @apiParam  {String} [userName] username
* @apiParam  {String} [email] Email
* @apiParam  {String} [firstName] String First Name
* @apiParam  {String} [lastName] String Last Name
*
* @apiSuccess (200) {Object} mixed `User` object
*/

exports.signup = asyncHandler(async (req, res, next) => {
	const { email, firstName, lastName } = req.body;
	const newUser = await user.create({
		data: {
			email,
			firstName,
			lastName
		}
	});

	res.status(201).json(newUser);
});
