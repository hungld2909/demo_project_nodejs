const User = require('../models/User')
const Deck = require('../models/Deck')
const JWT = require('jsonwebtoken')
const { JWT_SECRET } = require('../configs')

const encodedToken = (userID) => {
  return JWT.sign({
    iss: 'Hung Pink', //! người tạo
    sub: userID,
    iat : new Date().getTime(), //! ngày tạo Token
    exp: new Date().setDate(new Date().getDate() + 3) //! ngày hết hạn token khoảng 3 ngày
  },JWT_SECRET)
}


//signIn
const signIn = async (req, res, next) => {
  console.log('Call to signIn function.')
}


//signUp

const signUp = async (req, res, next) => {
  console.log('Call to signUp function.')
  const {firstName, lastName , email , password } = req.value.body
  // check user đã tồn tại
  const foundUser = await User.findOne({ email})
  console.log('foundUser', foundUser)
  if(foundUser) return res.status(403).json({message: 'Email is already in use'})


  //create a new user
  const newUser = new User({firstName, lastName, email, password})
  console.log('new user', newUser)
  newUser.save()
  //encode a Token
  const token = encodedToken(newUser._id)
  res.setHeader('Authorization',token)
  return res.status(201).json({success: true})

}

// secret
const secret = async (req, res, next) => {
  return res.status(200).json({ resources: true })
};

// do đã validate lên nó trả về value phù hợp 
// do đó xử dụng value thay vì: req.params
const getUser = async (req, res, next) => {
  const { userID } = req.value.params
  const user = await User.findById(userID)
  return res.status(200).json({ user })
}


const index = async (req, res, next) => {
  const users = await User.find({})
  return res.status(200).json({ users })

}
const createUser = async (req, res, next) => {
  const newUser = new User(req.value.body)
  await newUser.save()
  return res.status(201).json({ user: newUser })

}
const replaceUser = async (req, res, next) => {
  const { userID } = req.value.params
  const newUser = req.value.body
  const result = await User.findByIdAndUpdate(userID, newUser)
  return res.status(200).json({ success: true })

}
const updateUser = async (req, res, next) => {
  const { userID } = req.value.params
  const newUser = req.value.body
  const result = await User.findByIdAndUpdate(userID, newUser)
  return res.status(200).json({ success: true })

}
const getUserDecks = async (req, res, next) => {
  //Step 1: lấy ra các deck mà user đó sở hữu
  const { userID } = req.value.params
  //get user và join qua trường  (muốn join) decks.
  const user = await User.findById(userID).populate('decks')
  // console.log('user', user.decks)
  return res.status(200).json({ decks: user.decks })


}
const createUserDeck = async (req, res, next) => {
  const { userID } = req.value.params
  // Create a new deck
  const createDeck = new Deck(req.value.body)
  // get user 
  const user = await User.findById(userID)
  //  Assign user as a deck
  createDeck.owner = user
  //Save the Deck
  await createDeck.save()
  //do owner là array lên cần phải push thông tin vừa lấy được vào array đó
  user.decks.push(createDeck._id)
  // save the user
  await user.save()
  res.status(201).json({ deck: createDeck })

}


module.exports = {
  signIn,
  signUp,
  secret,
  getUser,
  index,
  createUser,
  replaceUser,
  updateUser,
  getUserDecks,
  createUserDeck,
}