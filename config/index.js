const { MONGOURI, SECRETORKEY, FRONTENDURLDEV, FRONTENDURLPROD, MAILHOST, MAILAUTHUSER, MAILAUTHPASS, NODE_ENV} = process.env

module.exports = {
    mongoURI: MONGOURI,
    secretOrKey: SECRETORKEY,
    frontendURL: NODE_ENV=="development" ? FRONTENDURLDEV : FRONTENDURLPROD, // Enter production url when in production,
    mailHost: MAILHOST,
    mailAuthUser: MAILAUTHUSER,
    mailAuthPass: MAILAUTHPASS
}