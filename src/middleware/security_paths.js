const { findUserById } = require('../services/user_service');

const pathRoles = path => {
    const roles =
    path.match("/admin/.\*") ? ["admin"] : 
    path.match("/user/.\*") ? ["user"] : 
    null;

    return roles;
}

module.exports = async (request, response, next) => {
    var BreakException = {};
    const user = await findUserById(request.userId);
    const rolesPath = pathRoles(request.route.path);
    console.log(rolesPath)
    try{
        rolesPath.forEach( role => {
            if(user.roles.includes(role)){
                throw BreakException;
            }
        });
        return response.status(403).json({ error: 'Not autorized for this page' });
    }catch(e){
        next();
    }
}