const express = require('express')
const router = require('express-promise-router')()
const UserController = require('../controllers/user')
const { validateParam, schemas, validateBody } = require('../helpers/routerHelpers')
const passport = require('passport')
const passportConfig = require('../middlewares/passport')

router.route('/signup').post(validateBody(schemas.authSignUpSchema), UserController.signUp)

router.route('/signin').post(validateBody(schemas.authSignInSchema),
 passport.authenticate('local', { session: false }), UserController.signIn,)

router.route('/secret').get(passport.authenticate('jwt', { session: false }), UserController.secret)

router.route('/')
  .get(UserController.index)
  .post(validateBody(schemas.userSchema), UserController.createUser)
router.route('/:userID')
  .get(validateParam(schemas.idSchema, 'userID'), UserController.getUser)
  .put(validateParam(schemas.idSchema, 'userID'), validateBody(schemas.userSchema), UserController.replaceUser)
  .patch(validateParam(schemas.idSchema, 'userID'), validateBody(schemas.userOptionalSchema), UserController.updateUser)

router.route('/:userID/decks')
  .get(validateParam(schemas.idSchema, 'userID'), UserController.getUserDecks)
  .post(validateParam(schemas.idSchema, 'userID'), validateBody(schemas.deckSchema), UserController.createUserDeck)

module.exports = router