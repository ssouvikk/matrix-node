const { Schema, model } = require("mongoose");
const { TOKEN_TYPES } = require("../Libs/Constants");

const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
    token: { type: String, required: true },
    type: { type: String, enum: Object.values(TOKEN_TYPES), default: TOKEN_TYPES.REGISTRATION },
    createdAt: { type: Date, default: Date.now },
    expired: { type: Boolean, default: false },
});
schema.index({ createdAt: 1 }, { expireAfterSeconds: 1000 });
class Token {

}

schema.loadClass(Token);

module.exports = model("tokens", schema);