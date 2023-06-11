const Config = require('../../Config');
const BaseService = require('./BaseService');
const bcrypt = require('bcrypt');
const { User, Token, } = require('../Models/DB');
const { NodeMailer } = require("../Libs/Mailer");
const { RegisterValidator, } = require('../Libs/Validator');
const { ROOT_PATH, TOKEN_SECRET, SALT_ROUND } = require('../../Config');
const { TOKEN_TYPES } = require('../Libs/Constants');

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
                url: `${Config.FRONT_URL}/verify-email/${token}`,
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


}

module.exports = new AuthService;