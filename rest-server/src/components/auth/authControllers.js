import db from '../../config/database';
import {
  signUpQuery,
  loginQuery
} from './authQueries';
import {
  success,
  error
} from '../../lib/log';
import {
  generateToken
} from '../../middleware/auth/jwt'
import {
  hashPassword
} from '../../middleware/auth/bcrypt'

export const signUpController = async (req, res) => {
  try {
    console.log('just recieved a signup request', req.body)
    req.body.password = await hashPassword(req.body.password)
    const { rows } = await signUpQuery(req.body);
    const { id, email } = rows[0];
    success('signUpController - successfully retrieved data ', JSON.stringify(rows[0]));
    const token = await generateToken(id, email);
    rows[0].token = token;
    return res.status(200).append('authorization', JSON.stringify(token)).send(rows[0]);
  } catch (err) {
    error('signUpController - error= ', err);
    throw new Error(err);
  }
};

export const loginController = async (req, res) => {
    console.log('just logged in this is the req.user', req.user)
  try {
    console.log('just recieved a log in request')
    const { rows } = await loginQuery(req.body);
    delete rows[0].password;
    const { id, email } = rows[0];
    success('loginController - successfully retrieved data ', rows[0]);
    const token = await generateToken(id, email);
    rows[0].token = token;
    return res.status(200).append('authorization', JSON.stringify(token)).send(rows[0]);
  } catch (err) {
    error('loginController - error= ', err);
    throw new Error(err);
  }
};
