const User = require('../models/User')
const Deck = require('../models/Deck')


const index = async (req, res, next) => {
  const decks = await Deck.find({})
  return res.status(200).json({ decks })

}
const createDeck = async (req, res, next) => {
  // find owner
  const owner = await User.findById(req.value.body.owner)

  // create a new decks
  const deck = req.value.body
  delete deck.owner
  deck.owner = owner._id
  const newDeck = new Deck(deck)
  await newDeck.save()

  // add newly created deck to the actual decks
  owner.decks.push(newDeck._id)
  await owner.save()
  return res.status(201).json({ deck: newDeck })
}

const getDeck = async (req, res, next) => {
  const deck = await Deck.findById(req.value.params.deckID)
  return res.status(200).json({ deck })

}

const replaceDeck = async (req, res, next) => {
  const { deckID } = req.value.params;
  const newDeck = req.value.body
  const result = await Deck.findByIdAndUpdate(deckID, newDeck)
  return res.status(200).json({ success: true })

}
const updateDeck = async (req, res, next) => {
  const { deckID } = req.value.params;
  const newDeck = req.value.body
  const result = await Deck.findByIdAndUpdate(deckID, newDeck)
  return res.status(200).json({ success: true })

}
const deleteDeck = async (req, res, next) => {
  //deckID phải trùng với router.route('/:deckID') truyền lên
  const { deckID } = req.value.params
  // Get id Deck
  const deck = await Deck.findById(deckID)
  const ownerID = deck.owner
  console.log('deleteDeck ownerID ', ownerID)
  // Get a owner deck
  const owner = await User.findById(ownerID)
  // Remove the deck 
  await deck.remove
  //Remove deck from owner's decks list
  owner.decks.pull(deck)
  await owner.save()
  return res.status(200).json({ success: true })

}
module.exports = {
  index,
  createDeck,
  getDeck,
  replaceDeck,
  updateDeck,
  deleteDeck

}