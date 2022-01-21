const { findUserById } = require('../services/user_service')

const pathRoles = path => {
  let roles = null
  if (path.match('/admin/.\*')) roles = ['admin'] // eslint-disable-line
  if (path.match('/user/.\*')) roles = ['user'] // eslint-disable-line

  return roles
}

module.exports = async (request, response, next) => {
  const BreakException = {}
  const user = await findUserById(request.userId)
  const rolesPath = pathRoles(request.route.path)
  console.log(rolesPath)
  try {
    rolesPath.forEach(role => {
      if (user.roles.includes(role)) {
        throw BreakException
      }
    })
    return response.status(403).json({ error: 'Not autorized for this page' })
  } catch (e) {
    next()
  }
}
