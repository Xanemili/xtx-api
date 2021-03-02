const jwt = require('jsonwebtoken');
const bearerToken = require('express-bearer-token');
const uuid = require('uuid').v4
const {User} = require('../../db/models');

const { jwtConfig: { secret, expiresIn } } = require('../../config');

function generateToken(user) {
  const data = user.toSafeObject();
  const jwtid = uuid();

  return {
    jwtid,
    token: jwt.sign({data}, secret, {expiresIn: Number.parseInt(expiresIn), jwtid})
  };
}

function restoreUser(req, res, next){
  const { token } = req;

  if (!token) {
    return(next({ status: 401, message: 'No Token'}));
  }

  return jwt.verify(token, secret, null, async (err, payload) => {
    if(err) {
      err.status = 403;
      return next(err);
    }

    const tokenId = payload.jti;

    try {
      req.user = await User.findByPk(payload.data.id);

    } catch(e){
      return next(e);
    }

    if(!req.user){
      return next({ status: 404, message: 'user session was not found'}).end();
    }

    return next();
  });
}

const authenticated = [bearerToken(), restoreUser];

module.exports = { generateToken, authenticated }
