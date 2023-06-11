const ejs = require("ejs");
const { createTransport } = require("nodemailer");
const { MAIL_DRIVER, MAIL_HOST, SMTP_PORT, MAIL_USERNAME, MAIL_PASSWORD, MAIL_FROM_ADDRESS, MAIL_FROM_NAME, } = require("../../Config")

const Mailer = createTransport({
	service: MAIL_DRIVER,

	port: SMTP_PORT,
	host: MAIL_HOST,

	auth: {
		user: MAIL_USERNAME,
		pass: MAIL_PASSWORD,
	},
});

class NodeMailer {
	constructor(param) {
		if (param.email && param.subject && param.template && param.data) {
			this.subject = param.subject;
			this.email = param.email;
			this.data = param.data;
			this.template = param.template;
		} else {
			throw Error("Mail parameter(s) missing");
		}
	}

	async sentMail() {
		try {
			const html = await ejs.renderFile(
				__dirname + "/../../public/" + this.template,
				this.data
			);
			const mainOptions = {
				from: MAIL_FROM_NAME + " <" + MAIL_FROM_ADDRESS + ">",
				to: this.email,
				subject: this.subject,
				html: html,
			};
			const check = await Mailer.sendMail(mainOptions);
			if (!check) {
				return false;
			}
			return true;
		} catch (err) {
			console.log(err);
		}
	}
}

module.exports = { NodeMailer };
