const { Schema, model } = require('mongoose');
const { USER_TYPES } = require('../Libs/Constants');

const schema = new Schema({
    type: { type: String, enum: Object.values(USER_TYPES), default: USER_TYPES.EMPLOYEE },
    profileImg: { type: String, },
    name: { type: String, },
    jwtToken: { type: String, },
    email: { type: String, unique: true, required: true },
    password: { type: String, default: null },
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null },
});

class User {

}

schema.loadClass(User);

module.exports = model('users', schema);