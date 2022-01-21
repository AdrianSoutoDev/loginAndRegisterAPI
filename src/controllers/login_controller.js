const loginService = require('../services/login_service')
const { usernameExists, emailExists } = require('../services/user_service')
const jwt = require('jsonwebtoken')
const { JWTSECRET } = require('../../config.js')

const login = async (request, response) => {
  const { body } = request
  const { username, password } = body

  const user = await loginService.login(username, password)
  if (user != null) {
    const jwtUser = {
      id: user._id,
      name: user.username,
      email: user.email
    }

    const token = jwt.sign(jwtUser, JWTSECRET, { expiresIn: 60 * 60 * 24 * 7 })

    return response.status(200).json({
      name: username,
      token
    })
  }
  return response.status(401).json({ error: 'Invalid user or password' })
}

const register = async (request, response) => {
  const { body } = request
  const { username, password, email } = body

  if (await usernameExists(username)) {
    return response.status(409).json('this username already exists: ' + username)
  };

  if (await emailExists(email)) {
    return response.status(409).json('this email already exists: ' + email)
  };

  const newUser = await loginService.register({ username, password, email })
  return response.status(201).json(newUser)
}

module.exports = {
  login,
  register
}
