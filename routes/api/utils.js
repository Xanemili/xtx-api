const jwt = require('jsonwebtoken');
const bearerToken = require('express-bearer-token');
const uuid = require('uuid').v4
const UserRepo = require('../../db/user-functions')

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

    const tokenId = payload.jwtid;

    try {
      req.user = await UserRepo.findByTokenId(tokenId);
    } catch(e){
      return next(e);
    }

    if(!req.user.isValid()){
      return next({ status: 404, message: 'user session was no found'});
    }

    next();
  });
}

const authenticated = [bearerToken(), restoreUser];

module.exports = { generateToken, authenticated }
