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

	static login(req, res, next) {
		AuthService.login(req)
			.then(result => res.status(result.status).json(result))
			.catch(err => next(err));
	}

	static forgotPassword(req, res, next) {
		AuthService.forgotPassword(req)
			.then(result => res.status(result.status).json(result))
			.catch(err => next(err));
	}

	static resetPassword(req, res, next) {
		AuthService.resetPassword(req)
			.then(result => res.status(result.status).json(result))
			.catch(err => next(err));
	}

}
module.exports = AuthController;