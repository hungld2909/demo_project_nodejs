const express = require('express')
const router = require('express-promise-router')()
const DeckController = require('../controllers/deck')
const { validateParam, schemas, validateBody } = require('../helpers/routerHelpers')

router.route('/')
  .get(DeckController.index)
  .post(validateParam(schemas.deckSchema), DeckController.createDeck)

router.route('/:deckID')
  .get(validateParam(schemas.idSchema, 'deckID'), DeckController.getDeck)
  .put(validateParam(schemas.idSchema, 'deckID'), validateBody(schemas.deckSchema), DeckController.replaceDeck)
  .patch(validateParam(schemas.idSchema, 'deckID'), validateBody(schemas.deckOptinalSchema), DeckController.updateDeck)
  .delete(validateParam(schemas.idSchema, 'deckID'), DeckController.deleteDeck)

module.exports = router