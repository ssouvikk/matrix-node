const { AuthService } = require('../Services');

class AuthController {

	/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: User registration
 *     description: Register a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [ADMIN, EMPLOYEE]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid request
 */

	static register(req, res, next) {
		AuthService.register(req)
			.then(result => res.status(result.status).json(result))
			.catch(err => next(err));
	}


	/**
 * @swagger
 * /api/v1/auth/verify-email/{token}:
 *   get:
 *     summary: Verify email
 *     description: Verify the user's email address using the verification token.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       404:
 *         description: Invalid or expired token
 */

	static verifyEmail(req, res, next) {
		AuthService.verifyEmail(req, res)
			.then(result => { res.status(result.status).json(result) })
			.catch(err => next(err));
	}

	/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user and generate an access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized access
 */

	static login(req, res, next) {
		AuthService.login(req)
			.then(result => res.status(result.status).json(result))
			.catch(err => next(err));
	}

	/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Forgot Password
 *     description: Request a password reset for the specified email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset request successful
 *       400:
 *         description: Invalid request or email not registered
 */

	static forgotPassword(req, res, next) {
		AuthService.forgotPassword(req)
			.then(result => res.status(result.status).json(result))
			.catch(err => next(err));
	}


	/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Reset Password
 *     description: Reset the password using the provided token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       201:
 *         description: Password reset successful
 *       400:
 *         description: Invalid request or unable to reset password
 */

	static resetPassword(req, res, next) {
		AuthService.resetPassword(req)
			.then(result => res.status(result.status).json(result))
			.catch(err => next(err));
	}


	/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: User logout
 *     description: Invalidate the user's access token to logout.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized access
 */

	static logout(req, res, next) {
		AuthService.logout(req)
			.then(result => res.status(result.status).json(result))
			.catch(err => next(err));
	}

	/**
	 * @swagger
	 * /api/v1/auth/me:
	 *   get:
	 *     summary: Get current user
	 *     description: Retrieve the details of the authenticated user.
	 *     security:
	 *       - bearerAuth: []
	 *     responses:
	 *       200:
	 *         description: User details retrieved successfully
	 *       401:
	 *         description: Unauthorized access
	 */


	static getMe(req, res, next) {
		AuthService.getMe(req)
			.then(result => res.status(result.status).json(result))
			.catch(err => next(err));
	}

}
module.exports = AuthController;