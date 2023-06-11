const { AuthService } = require('../Services');

class AuthController {
	static register(req, res, next) {
		AuthService.register(req)
			.then(result => res.status(result.status).json(result))
			.catch(err => next(err));
	}

	static verifyEmail(req, res, next) {
		AuthService.verifyEmail(req, res)
			.then(result => { res.status(result.status).json(result) })
			.catch(err => next(err));
	}

}
module.exports = AuthController;