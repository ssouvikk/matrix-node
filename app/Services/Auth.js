const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Config = require('../../Config');
const BaseService = require('./BaseService');
const { User, Token, } = require('../Models/DB');
const { NodeMailer } = require("../Libs/Mailer");
const { TOKEN_SECRET, SALT_ROUND, FRONT_URL } = require('../../Config');
const { TOKEN_TYPES } = require('../Libs/Constants');
const { USER_TYPES } = require('../Libs/Constants');
const {
    RegisterValidator,
    LoginValidator,
    forgetPasswordValidator,
    resetPasswordValidator
} = require('../Libs/Validator');

class AuthService extends BaseService {
    constructor() {
        super();
        this.message = ''
    }

    async sendRegistrationMail(user) {
        const token = `${Date.now()}_${Math.random()}`
        Token.create({
            type: TOKEN_TYPES.REGISTRATION,
            user: user._id,
            token: token
        });
        const nodeMailer = new NodeMailer({
            subject: 'Please confirm your email!',
            template: 'templates/registration.ejs',
            email: user.email,
            data: {
                url: `${FRONT_URL}/verify-email/${token}`,
                user,
            },
        });
        await nodeMailer.sentMail();
    }

    async register(req) {
        const { body } = req;
        const { error } = RegisterValidator(body)
        if (error) {
            this.message = error.message;
            return this.response(null, false, 400);
        }

        const { name, email, password, type } = body
        const user = await User.findOne({ email });
        if (!user || (user && !user.verified)) {
            if (user) {
                user.password = await bcrypt.hash(password, SALT_ROUND)
                user.name = name
                user.type = type
                await user.save()
                this.message = 'Successfully registered! Please verify your email';
                await this.sendRegistrationMail(user.toObject())
                return this.response({ ...user.toObject(), password: '' }, true, 201);
            } else {
                const newUser = await User.create({
                    ...body,
                    password: await bcrypt.hash(password, SALT_ROUND),
                });
                this.message = 'Successfully registered! Please verify your email';
                await this.sendRegistrationMail(newUser.toObject())
                return this.response({ ...newUser.toObject(), password: '' }, true, 201);
            }
        }
        this.message = 'The email is already registered';
        return this.response(null, false, 400);
    }

    async verifyEmail(req) {
        const { params: { token } } = req;
        const tokenDetails = await Token.findOne({ token, expired: false }).populate('user');
        if (tokenDetails) {
            tokenDetails.user.verified = true;
            await tokenDetails.user.save();

            tokenDetails.expired = true
            await tokenDetails.save()

            this.message = 'Congratulations! you have successfully verified your email';
            return this.response(null)
        }
        this.message = 'Link is invalid or expired';
        return this.response(null, false, 404);
    }

    async login(req) {
        const { body } = req;

        const { error } = LoginValidator(body);
        if (error) {
            this.message = error.message;
            return this.response(null, false, 400);
        }

        const user = await User.findOne({ email: body.email, })
        if (user && user.password) {
            const isPasswordValid = await bcrypt.compare(body.password, user.password)
            if (isPasswordValid) {
                if (user.type !== USER_TYPES.ADMIN) {
                    if (user.verified === false) {
                        this.message = 'Your email is not verified. Please verify your email';
                        return this.response(null, false, 400);
                    }
                }
                const { password, jwtToken, ...userWithoutHash } = user.toObject();
                const newToken = jwt.sign(userWithoutHash, TOKEN_SECRET, { expiresIn: '24h', issuer: 'https://scotch.io' })
                user.jwtToken = await bcrypt.hash(newToken, SALT_ROUND)
                await user.save()

                this.message = '';
                return this.response({ token: newToken, user: userWithoutHash });
            }
        }
        this.message = 'Email or password is incorrect';
        return this.response(null, false, 400);
    }

    async forgotPassword(req) {
        const { body } = req;

        const { error } = forgetPasswordValidator(body);
        if (error) {
            this.message = error.message;
            return this.response(null, false, 400);
        }

        const user = await User.findOne({ email: body.email });

        if (user) {
            const token = `${Date.now()}_${Math.random()}`
            Token.create({
                type: TOKEN_TYPES.FORGOT_PASSWORD,
                user: user._id,
                token
            });

            const link = `${FRONT_URL}/reset-password/${token}`;
            const mailOptions = {
                subject: 'Reset Password',
                email: body.email,
                template: 'templates/reset_password.ejs',
                data: { link, user, },
            }

            const nodeMailer = new NodeMailer(mailOptions);
            await nodeMailer.sentMail();

            this.message = 'Please check your registered email';
            return this.response(null, true, 200);
        } else {
            this.message = 'The email is not registered';
            return this.response(null, false, 400);
        }
    }

    async resetPassword(req) {
        const { body } = req;

        const { error } = resetPasswordValidator(body);
        if (error) {
            this.message = error.message;
            return this.response(null, false, 400);
        }

        if (body.password != body.confirmPassword) {
            this.message = 'Passwords are not matching';
            return this.response(null, false, 400);
        }

        const token = await Token.findOne({ token: body.token, expired: false }).populate('user');
        if (token) {
            token.user.password = await bcrypt.hash(body.password, SALT_ROUND);
            await token.user.save();

            token.expired = true
            await token.save();

            this.message = "Password updated sucessfully";
            return this.response(null, true, 200);
        }
        this.message = "Unable to reset password. Please try again.";
        return this.response(null, false, 400);
    }

    async logout(req) {
        const { user } = req;
        user.jwtToken = ''
        await user.save()
        this.message = '';
        return this.response(user, true, 200);
    }

    async getMe(req) {
        this.message = '';
        const { user } = req;
        return this.response({ ...user.toObject(), password: '' });
    }

}

module.exports = new AuthService;