const Joi = require('joi');
const userSchema = require('../schemas/RR-UserSchema');
const bcrypt = require('bcrypt');

const RRregistrationValidation = async (req, res, next) => {
  console.log('req ===', req.body);
  const { username } = req.body;
  const isTaken = await userSchema.findOne({ username: username });

  if (isTaken) {
    return res.status(400).json({ error: true, data: [{ message: 'Username already taken' }] });
  }
  const joiSchema = Joi.object({
    username: Joi.string().trim().min(3).max(35).required(),
    password1: Joi.string().trim().min(4).max(20).required(),
    password2: Joi.any().valid(Joi.ref('password1')).required(),
  });
  console.log('req.body ===', req.body);
  try {
    const valRes = await joiSchema.validate(req.body, { abortEarly: false });
    console.log('valRes ===', valRes);
    if (valRes.error) {
      return res
        .status(400)
        .json({ error: true, data: [{ message: 'Field Validation Error', errorData: valRes.error }] });
    }
    console.log('valRes ===', valRes);
    next();
  } catch (error) {
    console.log('error ===', error);
    res.status(400).json({ error: true, data: error.details });
  }
};

const RRloginValidation = async (req, res, next) => {
  const { username, password } = req.body;

  const user = await userSchema.findOne({ username: username });

  const joiSchema = Joi.object({
    username: Joi.string().trim().required(),
    password: Joi.string().trim().required(),
  });

  try {
    const valRes = await joiSchema.validateAsync(req.body, { abortEarly: false });
    if (!user) return res.status(400).json({ error: true, data: [{ message: 'User not found' }] });
    const passCompare = await bcrypt.compare(password, user.password);
    if (!passCompare) return res.status(400).json({ error: true, message: 'Incorrect password or username' });
    if (valRes.error) {
      return res
        .status(400)
        .json({ error: true, data: [{ message: 'Field Validation Error', errorData: valRes.error }] });
    }
    next();
  } catch (error) {
    console.log('error ===', error);
    return res.status(400).json({ error: true, message: 'Field validation error', data: error.details });
  }
};

module.exports = {
  RRregistrationValidation,
  RRloginValidation,
};
