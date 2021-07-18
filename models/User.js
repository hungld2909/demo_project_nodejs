const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const UserSchema = new Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true

  },
  password: {
    type: String,
    required: true
  },
  decks: [{
    type: Schema.Types.ObjectId,
    ref: 'Deck'
  }]
})

// mã hóa mật khẩu
// trước khi save
UserSchema.pre('save', async function (next) {
  try {
    // Generate a salt
    console.log('password', this.password)
    const salt = await bcrypt.genSalt(10)
    console.log('password salt', salt)
    // Generate a password hash (salt + hash)
    const passwordHashed = await bcrypt.hash(this.password, salt)
    console.log('passwordHashed', passwordHashed)
    // Re assign password hashed
    this.password = passwordHashed
    next()

  } catch (error) {
    next(error)
  }
})

UserSchema.methods.isValidPassword = async function (newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.password)

  } catch (error) {
    throw new Error(error)

  }
}

const User = mongoose.model('User', UserSchema)
module.exports = User