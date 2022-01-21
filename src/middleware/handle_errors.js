const ERROR_HANDLERS = {
  JsonWebTokenError: res =>
    res.status(401).json({ error: 'token missing or invalid' }),

  TokenExpiredError: res =>
    res.status(401).json({ error: 'Session expired' }),

  defaultError: (res, error) => {
    console.error(error.name)
    res.status(500).json({ error: 'Internal error, please, contact technical service' })
  }
}

module.exports = (error, request, response, next) => {
  const handler =
    ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError

  handler(response, error)
}
