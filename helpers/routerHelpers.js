const Joi = require('joi');


const validateBody = (schema) => {
  return (req, res, next) => {
    const validatorResult = schema.validate(req.body)
    if (validatorResult.error) {
      return res.status(400).json(validatorResult.error)
    } else {
      if (!req.value) req.value = {}
      if (!req.value['params']) req.value.params = {}
      console.log(validatorResult)
      req.value.body = validatorResult.value
      next()
      // next để controller handle
    }
  }
}

// Fuction kiểm tra
const validateParam = (schema, name) => {
  return (req, res, next) => {
    console.log('params', req.params[name])
    const validatorResult = schema.validate({ param: req.params[name] })
    console.log('result', validatorResult)
    if (validatorResult.error) {
      return res.status(400).json(validatorResult.error)
    } else {

      // do đã validate lên nó trả về value phù hợp 
      // do đó xử dụng value thay vì: req.params
      // mặc định ban đầu k có req.value 
      // do đó phải check nếu k có value thì thì tạo 1 value trống để lưu giá trị param
      console.log('step1', req.value)
      if (!req.value) req.value = {}
      console.log('step2', req.value.params)
      if (!req.value['params']) req.value.params = {}
      console.log('step3', req.value)
      req.value.params[name] = req.params[name]
      console.log('step4', req.value)
      next()
    }
  }
}

// handle điều kiện
const schemas = {

  //! login

  authSignUpSchema: Joi.object().keys({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),
  authSignInSchema: Joi.object().keys({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  //! User


  idSchema: Joi.object().keys({
    param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  }),

  userSchema: Joi.object().keys({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    email: Joi.string().email().required()

  }),
  userOptionalSchema: Joi.object().keys({
    firstName: Joi.string().min(2),
    lastName: Joi.string().min(2),
    email: Joi.string().email()
  }),
  deckSchema: Joi.object().keys({
    name: Joi.string().min(6).required(),
    description: Joi.string().min(10).required(),
  }),

  deckSchema: Joi.object().keys({
    name: Joi.string().min(6).required(),
    description: Joi.string().min(10).required(),
    owner: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  }),
  deckOptinalSchema: Joi.object().keys({
    name: Joi.string().min(6),
    description: Joi.string().min(10),
    owner: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
  }),

}

module.exports = {
  validateParam,
  schemas,
  validateBody
}