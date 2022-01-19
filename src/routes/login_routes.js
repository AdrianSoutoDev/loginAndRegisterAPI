module.exports = (app) => {

    var loginController = require('../controllers/login_controller');

    app.route('/login')
        .post( loginController.login)

    app.route('/register')
        .post( loginController.register )
}

