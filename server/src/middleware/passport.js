//Encrypts and decrypts JWT token
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { publicKey } from '../lib/keys.js';

import User from '../models/User.js';

const options = {
  //goes into headers and gets bearer token
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: publicKey,
  algorithms: ['RS256']
};

//Verifys what we get back from JWT
const verifyCallback = function(payload, done) {
  //Checks the user exists
  User.findOne({_id: payload.sub})
    .then((user) => {
      if (user) {
          return done(null, user);
      } else {
          return done(null, false);
      }        
    })
    .catch(err => done(err, null));
};
const jwtStrategy = () => new JwtStrategy(options, verifyCallback);

export default jwtStrategy;