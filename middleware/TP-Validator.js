const Joi = require('joi');
const userSchema = require('../schemas/UserSchema');
const bcrypt = require('bcrypt');

const registrationValidation = async (req, res, next) => {
  const { email } = req.body;
  const isTaken = await userSchema.findOne({ email: email });

  if (isTaken) {
    return res.status(400).json({ error: true, data: [{ message: 'Email already taken' }] });
  }
  const joiSchema = Joi.object({
    name: Joi.string().trim().min(3).max(35).required(),
    email: Joi.string().trim().email().required(),
    password1: Joi.string().trim().min(4).max(20).required(),
    password2: Joi.any().valid(Joi.ref('password1')).required(),
    notes: Joi.array().required(),
    lastName: Joi.string().trim(),
    image: Joi.string().trim(),
  });

  try {
    await joiSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    console.log('error ===', error);
    res.status(400).json({ error: true, data: error.details });
  }
};

const loginValidation = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userSchema.findOne({ email: email });

  const joiSchema = Joi.object({
    email: Joi.string().trim().required(),
    password: Joi.string().trim().required(),
  });

  try {
    await joiSchema.validateAsync(req.body, { abortEarly: false });

    if (!user) return res.status(400).json({ error: true, data: [{ message: 'User not found' }] });
    const passCompare = await bcrypt.compare(password, user.password);
    if (!passCompare) return res.status(400).json({ error: true, message: 'Incorrect password or username' });
    next();
  } catch (error) {
    console.log('error ===', error);
    return res.status(400).json({ error: true, message: 'Field validation error', data: error.details });
  }
};

module.exports = {
  registrationValidation,
  loginValidation,
};
