// Rename this file to index.js and enter your credentials
module.exports = {
    mongoURI: "you_mongo_uri",
    secretOrKey: "your_secret_or_key_for_jwt_passport",
    frontendURL: "http://localhost:3000", // Enter production url when in production,
    mailHost:'smtp.mailtrap.io',//, This is just for trial, in production a real mail service will be used
    mailAuthUser:'your_mail_service_username',
    mailAuthPass:'your_mail_service_password'
}