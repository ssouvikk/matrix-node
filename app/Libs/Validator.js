const Joi = require('joi');
const { USER_TYPES } = require('./Constants');

const VALIDATIONS = {
    EMAIL: Joi.string().email().required(),
    PASSWORD: Joi.string().required().min(6).max(16),
    STRING_REQUIRED: Joi.string().required(),
    // USER_TYPES: Joi.string().valid(Object.values(USER_TYPES).join(',')),
};

class Validator {

    static RegisterValidator(params) {
        const schema = Joi.object().keys({
            email: VALIDATIONS.EMAIL,
            password: VALIDATIONS.PASSWORD,
            name: VALIDATIONS.STRING_REQUIRED,
            type: VALIDATIONS.STRING_REQUIRED,
        });
        return schema.validate(params);
    }

    
}

module.exports = Validator;
