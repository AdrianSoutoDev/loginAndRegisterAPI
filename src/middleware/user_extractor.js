const jwt = require('jsonwebtoken');
const {JWTSECRET} = require('../../config.js');
module.exports = (request, response, next) => {

    const auth = request.get('Authorization');
    let token = null
    if(auth && auth.toLowerCase().startsWith('bearer')){
        token = auth.substring(7)
        decodedToken = jwt.verify(token, JWTSECRET)

        if(!token || !decodedToken.id){
            return response.status(401).json({error: "Token missing or invalid"})
        }   

        const { id } = decodedToken
        request.userId = id;
   }

   next();

}