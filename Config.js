require('dotenv').config();

module.exports = {
    FRONT_URL: process.env.FRONT_URL || 'http://localhost:3000',
    SALT_ROUND: 10,
    
    PORT: process.env.PORT || 5000,
    TOKEN_SECRET: process.env.TOKEN_SECRET,
    DB_URL: process.env.DB_URL,

    MAIL_DRIVER: process.env.MAIL_DRIVER,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,

    SMTP_USERNAME: process.env.SMTP_USERNAME,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,

    MAIL_FROM_NAME: process.env.MAIL_FROM_NAME,
    MAIL_FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS,

};